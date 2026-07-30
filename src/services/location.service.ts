import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { Location, LocationEnv, PaginatedResponse, PaginationParams } from '@/types';

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
  locationEnv?: LocationEnv;
}

export interface UpdateLocationData extends Partial<CreateLocationData> {
  isActive?: boolean;
}

export interface GetLocationsParams extends PaginationParams {
  name?: string;
  search?: string;
}

class LocationService {
  async getAllLocations(
    env: string,
    params?: GetLocationsParams,
  ): Promise<Location[] | PaginatedResponse<Location>> {
    return httpService.get<Location[] | PaginatedResponse<Location>>(
      API_CONFIG.endpoints.locations.base(env),
      { params },
    );
  }

  async getLocationById(env: string, id: string) {
    return httpService.get<Location>(API_CONFIG.endpoints.locations.byId(env, id));
  }

  async createLocation(env: string, data: CreateLocationData) {
    return httpService.post<Location>(API_CONFIG.endpoints.locations.create(env), data);
  }

  async updateLocation(env: string, id: string, data: UpdateLocationData) {
    return httpService.patch<Location>(API_CONFIG.endpoints.locations.update(env, id), data);
  }

  async deleteLocation(id: string) {
    return httpService.delete(API_CONFIG.endpoints.locations.delete(id));
  }

  async applyTariffToLocation(id: string, tariffId: string) {
    return httpService.post(`/locations/${id}/apply-tariff`, { tariffId });
  }

  async transferLocationEnv(id: string, targetEnv: LocationEnv) {
    return httpService.post(API_CONFIG.endpoints.locations.transferEnv(id), { targetEnv });
  }
}

export const locationService = new LocationService();
