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
    return httpService.get<TenantListResponse[]>(
      API_CONFIG.endpoints.tenants.base,
      { params }
    );
  }

  async getTenantById(id: string) {
    return httpService.get<Tenant>(
      API_CONFIG.endpoints.tenants.byId(id)
    );
  }

  async createTenant(tenantData: CreateTenantData) {
    return httpService.post<Tenant>(
      API_CONFIG.endpoints.tenants.base,
      tenantData
    );
  }

  async activateTenant(id: string) {
    return httpService.post<{ apiSecret: string; message: string }>(API_CONFIG.endpoints.tenants.activate(id));
  }

  async deactivateTenant(id: string) {
    return httpService.post(API_CONFIG.endpoints.tenants.deactivate(id));
  }

  async regenerateApiSecret(id: string) {
    return httpService.post<{ apiSecret: string }>(API_CONFIG.endpoints.tenants.regenerateSecret(id));
  }

  async connectStripe(id: string) {
    return httpService.post<{ url: string }>(API_CONFIG.endpoints.tenants.connectStripe(id));
  }
}

export const tenantService = new TenantService();
