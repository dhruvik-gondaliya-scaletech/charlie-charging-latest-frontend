import { useQuery } from '@tanstack/react-query';
import { tenantConfigService } from '@/services/tenant-config.service';

export const useTenantConfig = () => {
  return useQuery({
    queryKey: ['tenant-config'],
    queryFn: () => tenantConfigService.getConfig(),
    staleTime: 60000,
  });
};
