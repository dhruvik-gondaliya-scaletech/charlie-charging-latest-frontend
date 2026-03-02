import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, ChangePasswordData, UpdateProfileData } from '@/services/user.service';
import { toast } from 'sonner';

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => userService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
};
