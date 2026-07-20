import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { Station, OcppLogResponse, GetConfigurationResponse, ChargingStatus, ConnectorType, Session, SessionFilterParams, StationChargingProfile, SessionStats } from '@/types';

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
  tariffId: string;
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
  tariffId?: string;
  ocppConfiguration?: Record<string, unknown>;
  status?: ChargingStatus;
}

export interface GetStationsParams {
  name?: string;
  status?: string;
  locationId?: string;
  type?: string;
  visibility?: string;
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
  timezoneOffset?: number;
  timezone?: string;
}

export interface StationStats {
  total: number;
  active: number;
  offline: number;
  faulted: number;
}

class StationService {
  async getAllStations(env: string, params?: GetStationsParams) {
    return httpService.get<Station[]>(API_CONFIG.endpoints.stations.base(env), {
      params,
    });
  }

  async getStationStats(env: string) {
    return httpService.get<StationStats>(API_CONFIG.endpoints.stations.stats(env));
  }

  async getStationById(env: string, id: string) {
    return httpService.get<Station>(API_CONFIG.endpoints.stations.byId(env, id));
  }

  async createStation(env: string, stationData: CreateStationData) {
    return httpService.post<Station>(API_CONFIG.endpoints.stations.create(env), stationData);
  }

  async updateStation(env: string, id: string, stationData: UpdateStationData) {
    return httpService.patch<Station>(API_CONFIG.endpoints.stations.update(env, id), stationData);
  }

  async deleteStation(id: string) {
    return httpService.delete(API_CONFIG.endpoints.stations.delete(id));
  }

  async remoteStartTransaction(id: string, connectorId: number, idTag: string, userId: string) {
    return httpService.post(API_CONFIG.endpoints.stations.remoteStart(id), {
      connectorId,
      idTag,
      userId
    });
  }

  async remoteStopTransaction(id: string, transactionId: string | number) {
    return httpService.post(API_CONFIG.endpoints.stations.remoteStop(id), {
      transactionId,
    });
  }

  async resetStation(id: string, type: 'Hard' | 'Soft') {
    return httpService.post(API_CONFIG.endpoints.stations.reset(id), {
      type,
    });
  }

  async changeAvailability(id: string, type: 'Operative' | 'Inoperative', connectorId?: number) {
    return httpService.post(API_CONFIG.endpoints.stations.availability(id), {
      type,
      connectorId,
    });
  }

  async unlockConnector(id: string, connectorId: number) {
    return httpService.post(API_CONFIG.endpoints.stations.unlock(id), {
      connectorId,
    });
  }

  async getOcppLogs(stationId: string, filters?: GetOcppLogsParams): Promise<OcppLogResponse> {
    const data = await httpService.get<OcppLogResponse>(API_CONFIG.endpoints.stations.ocppLogs(stationId), {
      params: filters,
    });
    return data || { logs: [], total: 0, limit: 100, offset: 0 };
  }

  async exportOcppLogs(filters?: GetOcppLogsParams) {
    return httpService.get<Blob>(API_CONFIG.endpoints.stations.exportOcppLogs(), {
      params: filters,
      responseType: 'blob',
    });
  }

  async getStationSessions(env: string, stationId: string, filters?: SessionFilterParams) {
    return httpService.get<Session[]>(API_CONFIG.endpoints.stations.sessions(env, stationId), {
      params: filters,
    });
  }

  async getStationSessionStats(env: string, stationId: string): Promise<SessionStats> {
    return httpService.get<SessionStats>(API_CONFIG.endpoints.stations.sessionStats(env, stationId));
  }

  async getConfiguration(env: string, stationId: string, keys?: string[], category?: string): Promise<GetConfigurationResponse> {
    return httpService.get<GetConfigurationResponse>(API_CONFIG.endpoints.stations.configuration(env, stationId), {
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

  async getStationChargingProfile(stationId: string): Promise<StationChargingProfile> {
    return httpService.get<StationChargingProfile>(API_CONFIG.endpoints.stations.chargingProfile(stationId));
  }

  async getLiveChargingProfile(stationId: string) {
    return httpService.get<any>(API_CONFIG.endpoints.stations.liveChargingProfile(stationId));
  }

  async setStationChargingLimit(stationId: string, unit: 'A' | 'W', value: number) {
    return httpService.post(API_CONFIG.endpoints.stations.chargingProfile(stationId), {
      unit,
      value,
    });
  }

  async removeStationChargingLimit(stationId: string) {
    return httpService.delete(API_CONFIG.endpoints.stations.chargingProfile(stationId));
  }
}

export const stationService = new StationService();
