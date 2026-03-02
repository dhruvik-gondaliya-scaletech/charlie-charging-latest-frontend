import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stationService, UpdateStationData } from '@/services/station.service';
import { toast } from 'sonner';

export const useUpdateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStationData }) =>
      stationService.updateStation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['station', variables.id] });
      toast.success('Station updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update station');
    },
  });
};
