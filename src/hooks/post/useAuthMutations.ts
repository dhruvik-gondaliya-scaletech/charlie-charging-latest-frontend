import { useMutation } from '@tanstack/react-query';
import { authService, RegisterData, InviteUserData, AcceptInvitationData } from '@/services/auth.service';
import { toast } from 'sonner';

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      toast.success('Registration successful! Please check your email to verify your account.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verified successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Email verification failed');
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
      toast.error(error.response?.data?.message || 'Failed to resend verification email');
    },
  });
};

export const useInviteUser = () => {
  return useMutation({
    mutationFn: (data: InviteUserData) => authService.inviteUser(data),
    onSuccess: () => {
      toast.success('User invited successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to invite user');
    },
  });
};

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: AcceptInvitationData }) =>
      authService.acceptInvitation(token, data),
    onSuccess: () => {
      toast.success('Invitation accepted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to accept invitation');
    },
  });
};
