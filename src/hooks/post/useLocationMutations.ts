import { useMutation, useQueryClient } from '@tanstack/react-query';
import { locationService, CreateLocationData } from '@/services/location.service';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { toast } from 'sonner';
import { LocationEnv } from '@/types';

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  const { environment } = useEnvironment();

  return useMutation({
    mutationFn: (data: CreateLocationData) => locationService.createLocation(environment, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create location');
    },
  });
};

export const useTransferLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, targetEnv }: { id: string; targetEnv: LocationEnv }) => 
      locationService.transferLocationEnv(id, targetEnv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location environment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to transfer location');
    },
  });
};
