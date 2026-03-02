import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { Tenant, TenantListResponse } from '@/types';

export interface CreateTenantData {
  name: string;
  adminEmail: string;
  adminPassword: string;
  adminFirstName: string;
  adminLastName: string;
}

class TenantService {
  async getAllTenants(search?: string) {
    const params = search ? { search } : {};
    return httpService.get<{ success: boolean; data: TenantListResponse[] }>(
      API_CONFIG.endpoints.tenants.base,
      { params }
    );
  }

  async getTenantById(id: string) {
    return httpService.get<{ success: boolean; data: Tenant }>(
      API_CONFIG.endpoints.tenants.byId(id)
    );
  }

  async createTenant(tenantData: CreateTenantData) {
    return httpService.post<{ success: boolean; data: Tenant }>(
      API_CONFIG.endpoints.tenants.base,
      tenantData
    );
  }

  async activateTenant(id: string) {
    return httpService.post(API_CONFIG.endpoints.tenants.activate(id));
  }

  async deactivateTenant(id: string) {
    return httpService.post(API_CONFIG.endpoints.tenants.deactivate(id));
  }

  async regenerateApiSecret(id: string) {
    return httpService.post<{ apiSecret: string }>(API_CONFIG.endpoints.tenants.regenerateSecret(id));
  }
}

export const tenantService = new TenantService();
