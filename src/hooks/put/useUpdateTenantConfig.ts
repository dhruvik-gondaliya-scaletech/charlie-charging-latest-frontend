import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantConfigService, UpdateDriverAppConfigData } from '@/services/tenant-config.service';
import { toast } from 'sonner';

export const useUpdateTenantConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDriverAppConfigData) => {
      return tenantConfigService.updateConfig(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-config'] });
      toast.success('Configuration updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update configuration');
    },
  });
};
