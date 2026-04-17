import { useQuery } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';

export const useDrivers = () => {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: () => driverService.getAllDrivers(),
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
