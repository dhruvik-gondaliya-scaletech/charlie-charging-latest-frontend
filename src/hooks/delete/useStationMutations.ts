import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stationService, CreateStationData, UpdateStationData } from '@/services/station.service';
import { toast } from 'sonner';

export const useCreateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStationData) => stationService.createStation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast.success('Station created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create station');
    },
  });
};

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

export const useRemoteStart = () => {
  return useMutation({
    mutationFn: ({ id, connectorId, idTag, userId }: { id: string; connectorId: number; idTag: string; userId: string }) =>
      stationService.remoteStartTransaction(id, connectorId, idTag, userId),
    onSuccess: () => {
      toast.success('Remote start command sent');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start transaction remotely');
    },
  });
};

export const useRemoteStop = () => {
  return useMutation({
    mutationFn: ({ id, transactionId }: { id: string; transactionId: string | number }) =>
      stationService.remoteStopTransaction(id, transactionId),
    onSuccess: () => {
      toast.success('Remote stop command sent');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to stop transaction remotely');
    },
  });
};

export const useResetStation = () => {
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'Hard' | 'Soft' }) =>
      stationService.resetStation(id, type),
    onSuccess: () => {
      toast.success('Reset command sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reset station');
    },
  });
};

export const useChangeAvailability = () => {
  return useMutation({
    mutationFn: ({ id, type, connectorId }: { id: string; type: 'Operative' | 'Inoperative'; connectorId?: number }) =>
      stationService.changeAvailability(id, type, connectorId),
    onSuccess: () => {
      toast.success('Availability command sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change availability');
    },
  });
};

export const useSetConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, configurations }: { id: string; configurations: { key: string; value: string }[] }) =>
      stationService.setConfiguration(id, configurations),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['station-configuration', variables.id] });
      toast.success('Configuration updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update configuration');
    },
  });
};
