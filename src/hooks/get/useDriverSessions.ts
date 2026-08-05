import { useQuery } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';

export const useDriverSessions = (
  driverId: string,
  params?: { search?: string; page?: number; limit?: number },
) => {
  return useQuery({
    queryKey: ['driver-sessions', driverId, params],
    queryFn: () => driverService.getDriverSessions(driverId, params),
    enabled: !!driverId,
    staleTime: 30000,
  });
};
