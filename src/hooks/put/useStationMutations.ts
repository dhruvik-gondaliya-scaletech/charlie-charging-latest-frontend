import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stationService, UpdateStationData } from '@/services/station.service';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { toast } from 'sonner';

export const useUpdateStation = () => {
  const queryClient = useQueryClient();
  const { environment } = useEnvironment();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStationData }) =>
      stationService.updateStation(environment, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['station', environment, variables.id] });
      queryClient.invalidateQueries({ queryKey: ['station-stats', environment] });
      toast.success('Station updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update station');
    },
  });
};
