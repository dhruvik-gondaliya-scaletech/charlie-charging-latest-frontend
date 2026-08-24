import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { Driver, CreateDriverData, DriverSession } from '@/types';

class DriverService {
  async getAllDrivers(params?: { search?: string; name?: string; page?: number; limit?: number }) {
    return httpService.get<Driver[] | { data: Driver[]; meta: any }>(API_CONFIG.endpoints.drivers.base, { params });
  }

  async getDriverById(id: string) {
    return httpService.get<Driver>(API_CONFIG.endpoints.drivers.byId(id));
  }

  async createDriver(data: CreateDriverData) {
    return httpService.post<Driver>(API_CONFIG.endpoints.drivers.base, data);
  }

  async updateDriver(id: string, data: Partial<CreateDriverData>) {
    return httpService.put<Driver>(API_CONFIG.endpoints.drivers.byId(id), data);
  }

  async getDriverSessions(id: string, params?: { search?: string; page?: number; limit?: number }) {
    return httpService.get<
      DriverSession[] | { data: DriverSession[]; meta: { total: number; page: number; limit: number; totalPages: number } }
    >(API_CONFIG.endpoints.drivers.sessions(id), { params });
  }

  async deleteDriver(id: string) {
    return httpService.delete<{ message: string }>(API_CONFIG.endpoints.drivers.byId(id));
  }
}

export const driverService = new DriverService();
