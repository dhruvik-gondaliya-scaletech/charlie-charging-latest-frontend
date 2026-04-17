import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { Driver, CreateDriverData, DriverSession } from '@/types';

class DriverService {
  async getAllDrivers() {
    return httpService.get<Driver[]>(API_CONFIG.endpoints.drivers.base);
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

  async getDriverSessions(id: string) {
    return httpService.get<DriverSession[]>(API_CONFIG.endpoints.drivers.sessions(id));
  }
}

export const driverService = new DriverService();
