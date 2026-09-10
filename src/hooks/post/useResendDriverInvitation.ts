import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';
import { toast } from 'sonner';

export const useResendDriverInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => driverService.resendInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Invitation resent successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to resend invitation');
    },
  });
};
