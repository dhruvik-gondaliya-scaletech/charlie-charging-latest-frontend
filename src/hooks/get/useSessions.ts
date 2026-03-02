import { useQuery } from '@tanstack/react-query';
import { sessionService, GetSessionsParams } from '@/services/session.service';

export const useSessions = (filters?: any) => {
  return useQuery({
    queryKey: ['sessions', filters],
    queryFn: () => sessionService.getAllSessions(filters),
    staleTime: 30000,
  });
};

export const useSession = (id: string) => {
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionService.getSessionById(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useSessionsByStation = (stationId: string, filters?: GetSessionsParams) => {
  return useQuery({
    queryKey: ['sessions-by-station', stationId, filters],
    queryFn: () => sessionService.getSessionsByStation(stationId, filters),
    enabled: !!stationId,
    staleTime: 30000,
  });
};

export const useActiveSessionByStation = (stationId: string, connectorId?: number) => {
  return useQuery({
    queryKey: ['active-session', stationId, connectorId],
    queryFn: () => sessionService.getActiveSessionByStation(stationId, connectorId),
    enabled: !!stationId,
    staleTime: 10000,
  });
};
