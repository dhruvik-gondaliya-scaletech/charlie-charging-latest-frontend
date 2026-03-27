'use client';

import { useUserProfile } from '@/hooks/get/useUsers';
import { useUpdateProfile, useChangePassword } from '@/hooks/put/useUserMutations';
import { ProfileForm } from '../components/ProfileForm';
import { PasswordForm } from '../components/PasswordForm';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import {
    AlertTriangle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UserProfileFormData, ChangePasswordFormData } from '@/lib/validations/user.schema';
import { BackButton } from '@/components/shared/BackButton';

export function UserProfileContainer() {
    const router = useRouter();
    const { data: user, isLoading, error } = useUserProfile();
    const updateProfile = useUpdateProfile();
    const changePassword = useChangePassword();

    const handleProfileSubmit = (data: UserProfileFormData) => {
        updateProfile.mutate(data);
    };

    const handlePasswordSubmit = (data: ChangePasswordFormData) => {
        changePassword.mutate({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Skeleton className="h-[500px] md:col-span-2 rounded-3xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-48 rounded-3xl" />
                        <Skeleton className="h-[300px] rounded-3xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex items-center justify-center min-h-[600px] p-8">
                <div className="text-center space-y-4 max-w-md">
                    <div className="p-4 rounded-full bg-destructive/10 text-destructive inline-block">
                        <AlertTriangle className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-black">Identity Retrieval Failure</h2>
                    <p className="text-muted-foreground font-medium text-sm leading-relaxed uppercase tracking-wider opacity-60">
                        We were unable to secure your profile details. Your session may have expired or network integrity is compromised.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto"
        >
            {/* Header section with identity snapshot */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <BackButton
                        label="Return to Previous Matrix"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
                            {user.firstName || ''} {user.lastName || ''}
                            {(!user.firstName && !user.lastName) && 'Identity Unspecified'}
                        </h1>
                        <Badge
                            variant="outline"
                            className={cn(
                                "px-3 py-1 rounded-full border shadow-sm font-black uppercase tracking-widest text-[10px]",
                                user.isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-destructive/10 text-destructive border-destructive/30"
                            )}
                        >
                            {user.isActive ? 'Access Active' : 'Access Restricted'}
                        </Badge>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-8">
                    <ProfileForm
                        user={user}
                        onSubmit={handleProfileSubmit}
                        isLoading={updateProfile.isPending}
                    />
                </motion.div>

                <motion.div variants={fadeInUp} className="space-y-8">
                    {/* Security Card */}
                    <PasswordForm
                        onSubmit={handlePasswordSubmit}
                        isLoading={changePassword.isPending}
                    />

                    {/* Meta Info Card */}
                    {/* <div className="bg-card/20 backdrop-blur-sm border border-border/40 rounded-3xl p-6 space-y-6 shadow-sm border">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Account Protocol</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/5">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-primary opacity-60" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Permit Level</span>
                                </div>
                                <span className="text-sm font-bold capitalize">{user.role}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/5">
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4 text-emerald-500 opacity-60" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trust Score</span>
                                </div>
                                <span className="text-sm font-bold">{user.isEmailVerified ? 'Verified Identity' : 'Pending Verification'}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/5">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-500 opacity-60" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Commissioned</span>
                                </div>
                                <span className="text-sm font-bold">{formatDate(user.createdAt || '')}</span>
                            </div>
                        </div>
                    </div> */}
                </motion.div>
            </div>
        </motion.div>
    );
}
