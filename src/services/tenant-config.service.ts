import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';

export interface SupportContact {
  email?: string;
  phone?: string;
  website?: string;
}

export interface DriverAppConfig {
  id: string;
  tenantId: string;
  appName?: string;
  logoUrl?: string;
  supportContact?: SupportContact;
  domain: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDriverAppConfigData {
  appName?: string;
  logoUrl?: string;
  supportContact?: SupportContact;
  domain: string;
  isActive?: boolean;
}

class TenantConfigService {
  async getConfig() {
    return httpService.get<DriverAppConfig>(API_CONFIG.endpoints.drivers.appConfig);
  }

  async createConfig(data: UpdateDriverAppConfigData) {
    return httpService.post<DriverAppConfig>(API_CONFIG.endpoints.drivers.appConfig, data);
  }

  async updateConfig(data: UpdateDriverAppConfigData) {
    return httpService.patch<DriverAppConfig>(API_CONFIG.endpoints.drivers.appConfig, data);
  }
}

export const tenantConfigService = new TenantConfigService();
