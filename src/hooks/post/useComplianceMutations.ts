import { useMutation, useQueryClient } from '@tanstack/react-query';
import { complianceService, OverrideDowntimeDto } from '@/services/compliance.service';
import { toast } from 'sonner';

export const useOverrideDowntime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ intervalId, data }: { intervalId: string; data: OverrideDowntimeDto }) =>
      complianceService.overrideDowntime(intervalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-downtime-intervals'] });
      queryClient.invalidateQueries({ queryKey: ['compliance-uptime'] });
      queryClient.invalidateQueries({ queryKey: ['compliance-report'] });
      toast.success('Downtime interval reclassified successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reclassify downtime interval');
    },
  });
};
