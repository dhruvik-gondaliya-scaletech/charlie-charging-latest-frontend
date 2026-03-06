import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, InviteUserData, AcceptInvitationData } from '@/services/auth.service';
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

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: AcceptInvitationData }) =>
      authService.acceptInvitation(token, data),
    onSuccess: () => {
      toast.success('Invitation accepted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to accept invitation';
      toast.error(errorMessage);
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
    onSuccess: () => {
      toast.success('Verification email sent successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to resend verification email';
      toast.error(errorMessage);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: any) => authService.register(data),
    onSuccess: () => {
      toast.success('Registration successful. Please check your email to verify your account.');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
    },
  });
};
