import { useQuery } from '@tanstack/react-query';
import { tenantService } from '@/services/tenant.service';

export const useTenants = (search?: string) => {
  return useQuery({
    queryKey: ['tenants', search],
    queryFn: () => tenantService.getAllTenants(search),
    staleTime: 60000,
  });
};

export const useTenant = (id: string) => {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantService.getTenantById(id),
    enabled: !!id,
    staleTime: 60000,
  });
};
