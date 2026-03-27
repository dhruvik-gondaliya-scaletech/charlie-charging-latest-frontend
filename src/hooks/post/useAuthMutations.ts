import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, InviteUserData, AcceptInvitationData, ResetPasswordData } from '@/services/auth.service';
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

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success('If an account with this email exists, a password reset link has been sent.');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to process forgot password request';
      toast.error(errorMessage);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success('Password has been reset successfully. You can now login with your new password.');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
    },
  });
};
