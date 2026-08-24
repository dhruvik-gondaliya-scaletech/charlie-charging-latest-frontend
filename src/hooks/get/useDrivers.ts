import { useQuery } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';
import { Driver } from '@/types';

export type PaginatedDrivers = Driver[] & {
  meta?: { total: number; page: number; limit: number; totalPages: number };
};

export const useDrivers = (params?: { search?: string; name?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['drivers', params],
    queryFn: async (): Promise<PaginatedDrivers> => {
      const res = await driverService.getAllDrivers(params);
      if (res && typeof res === 'object') {
        if ('items' in res && Array.isArray((res as any).items)) {
          const list = [...(res as any).items] as PaginatedDrivers;
          list.meta = (res as any).meta;
          return list;
        }
        if ('data' in res && Array.isArray((res as any).data)) {
          const list = [...(res as any).data] as PaginatedDrivers;
          list.meta = (res as any).meta;
          return list;
        }
      }
      return (res || []) as PaginatedDrivers;
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
