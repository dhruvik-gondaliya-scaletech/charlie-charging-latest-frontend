import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantService, CreateTenantData } from '@/services/tenant.service';
import { toast } from 'sonner';

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantData) => tenantService.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create tenant');
    },
  });
};

export const useActivateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantService.activateTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant activated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to activate tenant');
    },
  });
};

export const useDeactivateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantService.deactivateTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deactivate tenant');
    },
  });
};

export const useRegenerateApiSecret = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantService.regenerateApiSecret(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
      toast.success('API secret regenerated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to regenerate API secret');
    },
  });
};
