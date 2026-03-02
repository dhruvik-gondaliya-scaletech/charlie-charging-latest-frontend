import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stationService } from '@/services/station.service';
import { toast } from 'sonner';

export const useDeleteStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => stationService.deleteStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast.success('Station deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete station');
    },
  });
};
