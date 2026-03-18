import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { Station, OcppLog, OcppLogResponse, GetConfigurationResponse, SetConfigurationResponse, BulkSetConfigurationResponse, ChargingStatus, ConnectorType, Session, SessionFilterParams } from '@/types';

export interface CreateStationData {
  name: string;
  serialNumber: string;
  model: string;
  vendor: string;
  firmware: string;
  isOccupied?: boolean;
  isActive?: boolean;
  maxPower: number;
  connectorTypes: ConnectorType[];
  locationId: string;
  chargePointId: string;
  ocppVersion: string;
  ocppConfiguration?: Record<string, unknown>;
}

export interface UpdateStationData {
  name?: string;
  model?: string;
  vendor?: string;
  firmware?: string;
  isOccupied?: boolean;
  isActive?: boolean;
  maxPower?: number;
  connectorTypes?: ConnectorType[];
  locationId?: string;
  ocppConfiguration?: Record<string, unknown>;
  status?: ChargingStatus;
}

export interface GetStationsParams {
  name?: string;
  status?: string;
  locationId?: string;
}

export interface GetOcppLogsParams {
  startDate?: string;
  endDate?: string;
  direction?: 'INCOMING' | 'OUTGOING';
  messageType?: string;
  messageId?: string;
  sessionId?: string;
  limit?: number;
  offset?: number;
}

class StationService {
  async getAllStations(params?: GetStationsParams) {
    const queryParams = new URLSearchParams();
    if (params?.name) queryParams.append('name', params.name);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.locationId) queryParams.append('locationId', params.locationId);

    const url = queryParams.toString() ? `${API_CONFIG.endpoints.stations.base}?${queryParams.toString()}` : API_CONFIG.endpoints.stations.base;
    return httpService.get<Station[]>(url);
  }

  async getStationById(id: string) {
    return httpService.get<Station>(API_CONFIG.endpoints.stations.byId(id));
  }

  async createStation(stationData: CreateStationData) {
    return httpService.post<Station>(API_CONFIG.endpoints.stations.base, stationData);
  }

  async updateStation(id: string, stationData: UpdateStationData) {
    return httpService.patch<Station>(API_CONFIG.endpoints.stations.byId(id), stationData);
  }

  async deleteStation(id: string) {
    return httpService.delete(API_CONFIG.endpoints.stations.byId(id));
  }

  async remoteStartTransaction(id: string, connectorId: number, idTag: string, userId: string) {
    return httpService.post(API_CONFIG.endpoints.stations.remoteStart(id), {
      connectorId,
      idTag,
    });
  }

  async remoteStopTransaction(id: string, transactionId: number) {
    return httpService.post(API_CONFIG.endpoints.stations.remoteStop(id), {
      transactionId,
    });
  }

  async getOcppLogs(stationId: string, filters?: GetOcppLogsParams): Promise<OcppLogResponse> {
    const data = await httpService.get<OcppLogResponse>(API_CONFIG.endpoints.stations.ocppLogs(stationId), {
      params: filters,
    });
    return data || { logs: [], total: 0, limit: 100, offset: 0 };
  }

  async getStationSessions(stationId: string, filters?: SessionFilterParams) {
    return httpService.get<Session[]>(API_CONFIG.endpoints.stations.sessions(stationId), {
      params: filters,
    });
  }

  async getConfiguration(stationId: string, keys?: string[], category?: string): Promise<GetConfigurationResponse> {
    return httpService.get<GetConfigurationResponse>(API_CONFIG.endpoints.stations.configuration(stationId), {
      params: { keys, category },
    });
  }

  async setConfiguration(stationId: string, configurations: { key: string; value: string }[]) {
    return httpService.post(API_CONFIG.endpoints.stations.setConfiguration(stationId), {
      configurations,
    });
  }

  async setSingleConfiguration(stationId: string, key: string, value: string) {
    return httpService.post(API_CONFIG.endpoints.stations.setConfiguration(stationId), {
      configurations: [{ key, value }],
    });
  }
}

export const stationService = new StationService();
