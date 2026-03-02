import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { Session } from '@/types';

export interface GetSessionsParams {
  stationId?: string;
  userId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

class SessionService {
  async getAllSessions(params?: GetSessionsParams) {
    return httpService.get<Session[]>(API_CONFIG.endpoints.sessions.base, { params });
  }

  async getSessionById(id: string) {
    return httpService.get<Session>(API_CONFIG.endpoints.sessions.byId(id));
  }

  async getSessionsByStation(stationId: string, params?: GetSessionsParams) {
    return httpService.get<Session[]>(API_CONFIG.endpoints.sessions.byStation(stationId), { params });
  }

  async getActiveSessionByStation(stationId: string, connectorId?: number) {
    return httpService.get<Session>(API_CONFIG.endpoints.sessions.active(stationId), {
      params: { connectorId },
    });
  }
}

export const sessionService = new SessionService();
