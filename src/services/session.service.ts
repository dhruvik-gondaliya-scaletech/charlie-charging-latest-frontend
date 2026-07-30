import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { Session, PaginatedResponse, PaginationParams } from '@/types';

export interface GetSessionsParams extends PaginationParams {
  stationId?: string;
  userId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  startFrom?: string;
  startTo?: string;
  locationId?: string;
  locationIds?: string;
  stationIds?: string;
  env?: string;
  sortBy?: string;
  sortOrder?: string;
}

class SessionService {
  async getAllSessions(params?: GetSessionsParams): Promise<Session[] | PaginatedResponse<Session>> {
    return httpService.get<Session[] | PaginatedResponse<Session>>(API_CONFIG.endpoints.sessions.base, { params });
  }

  async getSessionById(id: string) {
    return httpService.get<Session>(API_CONFIG.endpoints.sessions.byId(id));
  }

  async getSessionsByStation(stationId: string, params?: GetSessionsParams): Promise<Session[] | PaginatedResponse<Session>> {
    return httpService.get<Session[] | PaginatedResponse<Session>>(API_CONFIG.endpoints.sessions.byStation(stationId), { params });
  }

  async getActiveSessionByStation(stationId: string, connectorId?: number) {
    return httpService.get<Session>(API_CONFIG.endpoints.sessions.active(stationId), {
      params: { connectorId },
    });
  }

  async exportSessions(params?: {
    startFrom?: string;
    startTo?: string;
    columns?: string[];
    env?: string;
    locationId?: string;
    locationIds?: string;
    stationIds?: string;
  }) {
    const queryParams: Record<string, string> = {};
    if (params) {
      if (params.startFrom) queryParams.startFrom = params.startFrom;
      if (params.startTo) queryParams.startTo = params.startTo;
      if (params.env) queryParams.env = params.env;
      if (params.columns) queryParams.columns = params.columns.join(',');
      if (params.locationId) queryParams.locationId = params.locationId;
      if (params.locationIds) queryParams.locationIds = params.locationIds;
      if (params.stationIds) queryParams.stationIds = params.stationIds;
    }
    return httpService.get<Blob>(API_CONFIG.endpoints.sessions.export, {
      params: queryParams,
      responseType: 'blob',
    });
  }

}

export const sessionService = new SessionService();
