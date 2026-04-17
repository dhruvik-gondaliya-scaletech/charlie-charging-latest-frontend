import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';
import { CreateDriverData } from '@/types';
import { toast } from 'sonner';

export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDriverData) => driverService.createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Driver created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create driver');
    },
  });
};
