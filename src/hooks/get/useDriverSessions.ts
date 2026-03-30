import { useQuery } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';

export const useDriverSessions = (driverId: string) => {
  return useQuery({
    queryKey: ['driver-sessions', driverId],
    queryFn: () => driverService.getDriverSessions(driverId),
    enabled: !!driverId,
    staleTime: 30000,
  });
};
