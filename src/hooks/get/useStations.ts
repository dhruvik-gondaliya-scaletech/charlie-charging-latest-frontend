import { useQuery } from '@tanstack/react-query';
import { stationService, GetStationsParams, GetOcppLogsParams } from '@/services/station.service';

export const useStations = (params?: GetStationsParams) => {
  return useQuery({
    queryKey: ['stations', params],
    queryFn: () => stationService.getAllStations(params),
    staleTime: 30000,
  });
};

export const useStation = (id: string, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ['station', id],
    queryFn: () => stationService.getStationById(id),
    enabled: options.enabled !== undefined ? options.enabled && !!id : !!id,
    staleTime: 30000,
  });
};

export const useStationConfiguration = (stationId: string, keys?: string[], category?: string) => {
  return useQuery({
    queryKey: ['station-configuration', stationId, keys, category],
    queryFn: () => stationService.getConfiguration(stationId, keys, category),
    enabled: !!stationId,
    staleTime: 60000,
  });
};

export const useOcppLogs = (stationId: string, params?: GetOcppLogsParams) => {
  return useQuery({
    queryKey: ['station-logs', stationId, params],
    queryFn: () => stationService.getOcppLogs(stationId, params),
    staleTime: 5000,
    refetchInterval: 10000,
  });
};

export const useStationSessions = (stationId: string) => {
  return useQuery({
    queryKey: ['station-sessions', stationId],
    queryFn: () => stationService.getStationSessions(stationId),
    enabled: !!stationId,
    staleTime: 30000,
  });
};
