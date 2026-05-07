import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stationService } from '@/services/station.service';
import { toast } from 'sonner';

export const useSetChargingLimit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stationId, unit, value }: { stationId: string, unit: 'A' | 'W', value: number }) =>
      stationService.setStationChargingLimit(stationId, unit, value),
    onSuccess: (_, variables) => {
      toast.success(`Charging limit set to ${variables.value}${variables.unit}`);
      queryClient.invalidateQueries({ queryKey: ['station-charging-profile', variables.stationId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to set charging limit');
    },
  });
};

export const useRemoveChargingLimit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stationId: string) => stationService.removeStationChargingLimit(stationId),
    onSuccess: (_, stationId) => {
      toast.success('Charging limit removed');
      queryClient.invalidateQueries({ queryKey: ['station-charging-profile', stationId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove charging limit');
    },
  });
};
