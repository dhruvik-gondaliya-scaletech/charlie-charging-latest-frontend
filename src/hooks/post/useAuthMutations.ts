import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, InviteUserData } from '@/services/auth.service';
import { toast } from 'sonner';

export const useInviteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserData) => authService.inviteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Invitation sent successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to send invitation';
      toast.error(errorMessage);
    },
  });
};
