import { useQuery } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';
import { Driver } from '@/types';

export const useDrivers = (params?: { search?: string; name?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['drivers', params],
    queryFn: async () => {
      const res = await driverService.getAllDrivers(params);
      if (res && typeof res === 'object' && 'data' in res && Array.isArray((res as any).data)) {
        return (res as any).data as Driver[];
      }
      return (res || []) as Driver[];
    },
    staleTime: 30000,
  });
};

export const useDriver = (id: string) => {
  return useQuery({
    queryKey: ['driver', id],
    queryFn: () => driverService.getDriverById(id),
    enabled: !!id,
    staleTime: 30000,
  });
};
