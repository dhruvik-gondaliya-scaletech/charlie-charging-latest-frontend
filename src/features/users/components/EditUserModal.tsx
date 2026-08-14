'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema, UpdateUserFormData } from '@/lib/validations/user.schema';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Shield, Loader2, User as UserIcon } from 'lucide-react';
import { useRoles } from '@/hooks/get/useRbac';
import { useUser } from '@/hooks/get/useUsers';
import { useUpdateUser } from '@/hooks/patch/useUpdateUser';
import { UpdateUserRoleLocationDto } from '@/services/rbac.service';
import { Location, LocationEnv, User, AppRole } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Environment } from '@/constants/constants';
import { locationService } from '@/services/location.service';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
    const updateUser = useUpdateUser();
    const { data: fetchedUser, isLoading: userLoading } = useUser(isOpen ? user?.id || null : null);
    const { data: allRoles, isLoading: rolesLoading } = useRoles();
    const { data: devLocationsResponse, isLoading: devLoading } = useQuery({
        queryKey: ['locations', Environment.DEV],
        queryFn: () => locationService.getAllLocations(Environment.DEV),
        staleTime: 60000,
    });

    const { data: prodLocationsResponse, isLoading: prodLoading } = useQuery({
        queryKey: ['locations', Environment.PROD],
        queryFn: () => locationService.getAllLocations(Environment.PROD),
        staleTime: 60000,
    });

    const locationsLoading = devLoading || prodLoading;

    const devLocations = React.useMemo(() => {
        const locations = Array.isArray(devLocationsResponse)
            ? (devLocationsResponse as Location[])
            : ((devLocationsResponse as { data?: Location[] } | undefined)?.data ?? []);
        return locations.filter((loc) => loc.locationEnv === LocationEnv.DEVELOPMENT || !loc.locationEnv);
    }, [devLocationsResponse]);

    const prodLocations = React.useMemo(() => {
        const locations = Array.isArray(prodLocationsResponse)
            ? (prodLocationsResponse as Location[])
            : ((prodLocationsResponse as { data?: Location[] } | undefined)?.data ?? []);
        return locations.filter((loc) => loc.locationEnv === LocationEnv.PRODUCTION);
    }, [prodLocationsResponse]);

    const allLocations = React.useMemo(() => {
        return [...devLocations, ...prodLocations];
    }, [devLocations, prodLocations]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            roleId: '',
            locationIds: [],
            isActive: true,
        }
    });

    const selectedRoleId = watch('roleId');
    const selectedLocationIds = watch('locationIds') || [];

    // Check if the selected role is SITE_MANAGER
    const selectedRole = allRoles?.find((r) => r.id === selectedRoleId);
    const selectedRoleName = selectedRole?.name ? String(selectedRole.name).toUpperCase() : '';
    const isSiteManager = selectedRoleName === 'SITE_MANAGER' || selectedRoleName === 'OPERATOR';

    // Reset default values when fetchedUser or roles load, or when modal opens
    React.useEffect(() => {
        if (isOpen && fetchedUser && allRoles) {
            const fetchedUserAny = fetchedUser as any;
            
            let targetRoleId = '';
            if (fetchedUserAny.roleId) {
                targetRoleId = allRoles.find((r) => r.id === fetchedUserAny.roleId)?.id || '';
            }
            if (!targetRoleId && fetchedUserAny.role) {
                const roleStr = String(fetchedUserAny.role).toUpperCase();
                const mappedRoleName = 
                    roleStr === 'SUPER_ADMIN' || roleStr === 'SUPERADMIN' ? AppRole.SUPER_ADMIN :
                    roleStr === 'SITE_MANAGER' || roleStr === 'SITEMANAGER' || roleStr === 'OPERATOR' ? AppRole.SITE_MANAGER :
                    roleStr === 'VIEWER' ? AppRole.VIEWER :
                    AppRole.ADMIN;
                targetRoleId = allRoles.find(
                    (r) => r.name === mappedRoleName || 
                           r.name.toUpperCase().replace('_', '').replace(' ', '') === mappedRoleName.replace('_', '')
                )?.id || '';
            }

            const locationIds = fetchedUserAny.locationIds || 
                fetchedUserAny.locations?.map((l: any) => typeof l === 'string' ? l : l.id) || 
                [];

            reset({
                firstName: fetchedUserAny.firstName || '',
                lastName: fetchedUserAny.lastName || '',
                email: fetchedUserAny.email || '',
                roleId: targetRoleId,
                locationIds: locationIds,
                isActive: fetchedUserAny.isActive ?? true,
            });
        }
    }, [isOpen, fetchedUser, allRoles, reset]);

    // Clear locationIds if the role is changed from SITE_MANAGER
    React.useEffect(() => {
        if (!isSiteManager && selectedLocationIds.length > 0) {
            setValue('locationIds', []);
        }
    }, [isSiteManager, setValue, selectedLocationIds.length]);

    const onSubmit = (data: UpdateUserFormData) => {
        if (!user) return;
        const dto: UpdateUserRoleLocationDto = {
            firstName: data.firstName ?? undefined,
            lastName: data.lastName ?? undefined,
            email: data.email,
            roleId: data.roleId,
            locationIds: data.locationIds,
            isActive: data.isActive,
        };
        updateUser.mutate({
            id: user.id,
            dto,
        }, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (userLoading) {
        return (
            <AnimatedModal
                isOpen={isOpen}
                onClose={onClose}
                title="Edit User Details"
                description="Loading user details..."
                size="md"
            >
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AnimatedModal>
        );
    }

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit User Details"
            description="Update identity parameters, system permissions, and operational constraints."
            size="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">First Name</Label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="First Name"
                                className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                                {...register('firstName')}
                            />
                        </div>
                        {errors.firstName && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.firstName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Last Name</Label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Last Name"
                                className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                                {...register('lastName')}
                            />
                        </div>
                        {errors.lastName && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.lastName.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address (Read-only)</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                        <Input
                            id="email"
                            type="email"
                            disabled
                            placeholder="john.doe@enterprise.com"
                            className="pl-10 h-11 bg-muted/40 border-border/40 focus:ring-primary/20 rounded-xl font-bold opacity-60 cursor-not-allowed text-muted-foreground"
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

                <div className="flex items-center gap-3 bg-muted/10 border border-border/40 rounded-xl p-4">
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                id="isActive"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <div className="space-y-0.5">
                        <Label htmlFor="isActive" className="text-xs font-bold text-white/80 cursor-pointer">
                            Active Account
                        </Label>
                        <p className="text-[10px] text-muted-foreground font-medium">
                            Allow this user to access the platform.
                        </p>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {isSiteManager && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="space-y-2 overflow-hidden"
                        >
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                            dev
                                        </span>
                                        <div className="max-h-40 overflow-y-auto border border-border/40 bg-muted/10 rounded-xl p-3 space-y-2">
                                            {devLocations.length === 0 ? (
                                                <p className="text-[10px] text-white/40 p-1">No dev locations</p>
                                            ) : (
                                                devLocations.map((loc) => {
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
                                                                className="text-xs font-bold text-white/80 cursor-pointer hover:text-white transition-colors truncate"
                                                            >
                                                                {loc.name}
                                                            </Label>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                            Prod
                                        </span>
                                        <div className="max-h-40 overflow-y-auto border border-border/40 bg-muted/10 rounded-xl p-3 space-y-2">
                                            {prodLocations.length === 0 ? (
                                                <p className="text-[10px] text-white/40 p-1">No prod locations</p>
                                            ) : (
                                                prodLocations.map((loc) => {
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
                                                                className="text-xs font-bold text-white/80 cursor-pointer hover:text-white transition-colors truncate"
                                                            >
                                                                {loc.name}
                                                            </Label>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {errors.locationIds && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.locationIds.message}</p>}
                        </motion.div>
                    )}
                </AnimatePresence>

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
                        disabled={updateUser.isPending}
                        className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary shadow-lg shadow-primary/20"
                    >
                        {updateUser.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </AnimatedModal>
    );
}
