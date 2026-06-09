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

  async exportSessions(params?: { startFrom?: string; startTo?: string; columns?: string[]; env?: string }) {
    const queryParams: any = {};
    if (params) {
      if (params.startFrom) queryParams.startFrom = params.startFrom;
      if (params.startTo) queryParams.startTo = params.startTo;
      if (params.env) queryParams.env = params.env;
      if (params.columns) queryParams.columns = params.columns.join(',');
    }
    return httpService.get<Blob>(API_CONFIG.endpoints.sessions.export, {
      params: queryParams,
      responseType: 'blob',
    });
  }
}

export const sessionService = new SessionService();
