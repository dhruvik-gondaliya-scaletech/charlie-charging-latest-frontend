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
import { useRoles } from '@/hooks/get/useUsers';
import { useLocations } from '@/hooks/get/useLocations';
import { Mail, Shield, Loader2, MapPin } from 'lucide-react';
import { Role } from '@/types';

interface UserInvitationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UserInvitationModal({ isOpen, onClose }: UserInvitationModalProps) {
    const inviteUser = useInviteUser();
    const { data: roles } = useRoles();
    const { data: locations } = useLocations();

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<UserInvitationData>({
        resolver: zodResolver(userInvitationSchema),
        defaultValues: {
            email: '',
            roleId: '',
            locationId: '',
        }
    });

    const selectedRoleId = watch('roleId');
    const selectedRole = roles?.find((r: Role) => r.id === selectedRoleId);
    const isOperator = selectedRole?.name === 'operator';

    const onSubmit = (data: UserInvitationData) => {
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Role</Label>
                        <Controller
                            name="roleId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-muted-foreground/50" />
                                            <SelectValue placeholder="Select Role" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border/40">
                                        {roles?.map((role: Role) => (
                                            <SelectItem key={role.id} value={role.id} className="font-bold">
                                                {role.name.replace(/_/g, ' ').toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.roleId && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.roleId.message}</p>}
                    </div>

                    {isOperator && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assigned Location</Label>
                            <Controller
                                name="locationId"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ''}>
                                        <SelectTrigger className="h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground/50" />
                                                <SelectValue placeholder="Select Location" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/40">
                                            {locations?.map((loc) => (
                                                <SelectItem key={loc.id} value={loc.id} className="font-bold">
                                                    {loc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.locationId && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.locationId.message}</p>}
                        </div>
                    )}
                </div>

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
