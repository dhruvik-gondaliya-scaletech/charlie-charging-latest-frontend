'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/get/useUsers';
import { useUpdateProfile, useChangePassword } from '@/hooks/put/useUserMutations';
import { UpdateProfileFormData, ChangePasswordFormData } from '@/lib/validations/user.schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Lock } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileForm } from '../components/ProfileForm';
import { PasswordForm } from '../components/PasswordForm';

export function ProfileContainer() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const handleProfileSubmit = async (data: UpdateProfileFormData) => {
    await updateProfile.mutateAsync(data);
  };

  const handlePasswordSubmit = async (data: ChangePasswordFormData) => {
    await changePassword.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  if (!user) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6 max-w-4xl"
    >
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <motion.div variants={staggerItem}>
        <ProfileHeader user={user} />
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : profile ? (
              <ProfileForm
                profile={profile}
                onSubmit={handleProfileSubmit}
                isLoading={updateProfile.isPending}
              />
            ) : null}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm
              onSubmit={handlePasswordSubmit}
              isLoading={changePassword.isPending}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
