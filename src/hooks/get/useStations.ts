import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { stationService, GetStationsParams, GetOcppLogsParams } from '@/services/station.service';
import { SessionFilterParams } from '@/types';
import { useEnvironment } from '@/contexts/EnvironmentContext';

export const useStations = (params?: GetStationsParams) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['stations', environment, params],
    queryFn: () => stationService.getAllStations(environment, params),
    staleTime: 30000,
    placeholderData: keepPreviousData,
  });
};

export const useStationStats = () => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['station-stats', environment],
    queryFn: () => stationService.getStationStats(environment),
    staleTime: 30000,
    refetchInterval: 60000, // Refresh stats every minute
  });
};

export const useStation = (id: string, options: { enabled?: boolean } = {}) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['station', environment, id],
    queryFn: () => stationService.getStationById(environment, id),
    enabled: options.enabled !== undefined ? options.enabled && !!id : !!id,
    staleTime: 30000,
  });
};

export const useStationConfiguration = (stationId: string, keys?: string[], category?: string) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['station-configuration', environment, stationId, keys, category],
    queryFn: () => stationService.getConfiguration(environment, stationId, keys, category),
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

export const useInfiniteOcppLogs = (stationId: string, params?: GetOcppLogsParams) => {
  return useInfiniteQuery({
    queryKey: ['station-logs-infinite', stationId, params],
    queryFn: ({ pageParam = 0 }) =>
      stationService.getOcppLogs(stationId, { ...params, offset: pageParam as number }),
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    initialPageParam: 0,
    staleTime: 5000,
  });
};

export const useStationSessions = (stationId: string, params?: SessionFilterParams) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['station-sessions', environment, stationId, params],
    queryFn: () => stationService.getStationSessions(environment, stationId, params),
    enabled: !!stationId,
    staleTime: 30000,
  });
};

export const useStationSessionStats = (stationId: string) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['station-session-stats', environment, stationId],
    queryFn: () => stationService.getStationSessionStats(environment, stationId),
    enabled: !!stationId,
    staleTime: 30000,
  });
};
