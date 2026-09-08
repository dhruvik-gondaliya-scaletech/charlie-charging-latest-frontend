import { useQuery } from '@tanstack/react-query';
import { driverService, DriverSessionStats } from '@/services/driver.service';

export const useDriverSessionStats = (id: string) => {
  return useQuery<DriverSessionStats>({
    queryKey: ['driver-session-stats', id],
    queryFn: async (): Promise<DriverSessionStats> => {
      const res = await driverService.getDriverSessionStats(id);
      return res || {
        sessionCount: 0,
        totalEnergyKwh: 0,
        totalDurationMinutes: 0,
        totalCost: 0,
        currency: 'USD',
      };
    },
    enabled: !!id,
    staleTime: 30000,
  });
};
