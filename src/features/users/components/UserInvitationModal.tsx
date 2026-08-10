'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userInvitationSchema, UserInvitationData } from '@/lib/validations/user.schema';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInviteUser } from '@/hooks/post/useAuthMutations';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Shield, Loader2 } from 'lucide-react';
import { useRoles } from '@/hooks/get/useRbac';
import { useLocations } from '@/hooks/get/useLocations';
import { Location } from '@/types';

interface UserInvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UserInvitationModal({ isOpen, onClose }: UserInvitationModalProps) {
    const inviteUser = useInviteUser();
    const { data: allRoles, isLoading: rolesLoading } = useRoles();
    const { data: locationsResponse, isLoading: locationsLoading } = useLocations();

    const allLocations: Location[] = React.useMemo(() => {
        return Array.isArray(locationsResponse)
            ? (locationsResponse as Location[])
            : ((locationsResponse as { data?: Location[] } | undefined)?.data ?? []);
    }, [locationsResponse]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<UserInvitationData>({
        resolver: zodResolver(userInvitationSchema),
        defaultValues: {
            roleId: '',
            locationIds: [],
        }
    });

    const selectedRoleId = watch('roleId');
    const selectedLocationIds = watch('locationIds') || [];

    // Check if the selected role is SITE_MANAGER
    const selectedRole = allRoles?.find((r) => r.id === selectedRoleId);
    const isSiteManager = selectedRole?.name === 'SITE_MANAGER';

    // Clear locationIds if the role is changed from SITE_MANAGER
    React.useEffect(() => {
        if (!isSiteManager && selectedLocationIds.length > 0) {
            setValue('locationIds', []);
        }
    }, [isSiteManager, setValue, selectedLocationIds.length]);

    const onSubmit = (data: UserInvitationData) => {
        // Send the formatted payload containing roleId and optional locationIds
        inviteUser.mutate(data, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={() => {
                reset();
                onClose();
            }}
            title="Invite New User"
            description="Send a collaboration invitation to join the fleet management ecosystem."
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@enterprise.com"
                            className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                            {...register('email')}
                        />
                    </div>
                    {errors.email && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="roleId" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assign Role</Label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 z-10" />
                        <Controller
                            name="roleId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={rolesLoading}
                                >
                                    <SelectTrigger className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold">
                                        <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select a role"} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border/40">
                                        {allRoles?.map((r) => (
                                            <SelectItem key={r.id} value={r.id}>
                                                {r.name.replace('_', ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {errors.roleId && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.roleId.message}</p>}
                </div>

                {isSiteManager && (
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Scope Locations
                        </Label>
                        {locationsLoading ? (
                            <div className="flex items-center text-xs text-white/40 ml-1">
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                                Loading locations...
                            </div>
                        ) : allLocations.length === 0 ? (
                            <p className="text-xs text-white/40 ml-1">No locations configured in system.</p>
                        ) : (
                            <div className="max-h-40 overflow-y-auto border border-border/40 bg-muted/10 rounded-xl p-3 space-y-2">
                                {allLocations.map((loc) => {
                                    const isChecked = selectedLocationIds.includes(loc.id);
                                    return (
                                        <div
                                            key={loc.id}
                                            className="flex items-center gap-2.5 px-1 py-0.5"
                                        >
                                            <Checkbox
                                                id={`loc-${loc.id}`}
                                                checked={isChecked}
                                                onCheckedChange={(checked) => {
                                                    if (checked === true) {
                                                        setValue('locationIds', [...selectedLocationIds, loc.id], { shouldValidate: true });
                                                    } else {
                                                        setValue(
                                                            'locationIds',
                                                            selectedLocationIds.filter((id) => id !== loc.id),
                                                            { shouldValidate: true }
                                                        );
                                                    }
                                                }}
                                            />
                                            <Label
                                                htmlFor={`loc-${loc.id}`}
                                                className="text-xs font-bold text-white/80 cursor-pointer hover:text-white transition-colors"
                                            >
                                                {loc.name}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {errors.locationIds && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.locationIds.message}</p>}
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] border-border/40 hover:bg-muted"
                    >
                        Abort
                    </Button>
                    <Button
                        type="submit"
                        disabled={inviteUser.isPending}
                        className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary shadow-lg shadow-primary/20"
                    >
                        {inviteUser.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Dispatch Invite"
                        )}
                    </Button>
                </div>
            </form>
        </AnimatedModal>
    );
}
