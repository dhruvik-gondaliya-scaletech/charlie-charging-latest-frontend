import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { Location } from '@/types';

export interface CreateLocationData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

export interface UpdateLocationData extends Partial<CreateLocationData> {
  isActive?: boolean;
}

class LocationService {
  async getAllLocations(params?: { name?: string }) {
    return httpService.get<Location[]>(API_CONFIG.endpoints.locations.base, { params });
  }

  async getLocationById(id: string) {
    return httpService.get<Location>(API_CONFIG.endpoints.locations.byId(id));
  }

  async createLocation(data: CreateLocationData) {
    return httpService.post<Location>(API_CONFIG.endpoints.locations.base, data);
  }

  async updateLocation(id: string, data: UpdateLocationData) {
    return httpService.put<Location>(API_CONFIG.endpoints.locations.byId(id), data);
  }

  async deleteLocation(id: string) {
    return httpService.delete(API_CONFIG.endpoints.locations.byId(id));
  }

  async applyTariffToLocation(id: string, tariffId: string) {
    return httpService.post(`${API_CONFIG.endpoints.locations.byId(id)}/apply-tariff`, { tariffId });
  }
}

export const locationService = new LocationService();
