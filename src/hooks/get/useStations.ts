import { useQuery } from '@tanstack/react-query';
import { stationService, GetStationsParams } from '@/services/station.service';

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

export const useOcppLogs = (stationId: string, filters?: any) => {
  return useQuery({
    queryKey: ['ocpp-logs', stationId, filters],
    queryFn: () => stationService.getOcppLogs(stationId, filters),
    enabled: !!stationId,
    staleTime: 10000,
  });
};
