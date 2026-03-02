import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stationService, CreateStationData } from '@/services/station.service';
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

export const useRemoteStartTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, connectorId, idTag, userId }: { id: string; connectorId: number; idTag: string; userId: string }) =>
      stationService.remoteStartTransaction(id, connectorId, idTag, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['station', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Transaction started successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start transaction');
    },
  });
};

export const useRemoteStopTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, transactionId }: { id: string; transactionId: number }) =>
      stationService.remoteStopTransaction(id, transactionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['station', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Transaction stopped successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to stop transaction');
    },
  });
};

export const useSetStationConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stationId, configurations }: { stationId: string; configurations: { key: string; value: string }[] }) =>
      stationService.setConfiguration(stationId, configurations),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['station-configuration', variables.stationId] });
      toast.success('Configuration updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update configuration');
    },
  });
};

export const useSetSingleStationConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stationId, key, value }: { stationId: string; key: string; value: string }) =>
      stationService.setSingleConfiguration(stationId, key, value),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['station-configuration', variables.stationId] });
      toast.success('Configuration key updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update configuration key');
    },
  });
};
