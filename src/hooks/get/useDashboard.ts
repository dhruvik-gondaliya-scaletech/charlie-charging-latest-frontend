import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardParams } from '@/services/dashboard.service';
import { useEnvironment } from '@/contexts/EnvironmentContext';

export const useDashboardData = (params?: DashboardParams) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['dashboard', environment, params],
    queryFn: () => dashboardService.getDashboardData({ ...params, env: environment }),
    staleTime: 30000,
  });
};

export const useDashboardStats = (params?: DashboardParams) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['dashboard-stats', environment, params],
    queryFn: () => dashboardService.getDashboardStats({ ...params, env: environment }),
    staleTime: 30000,
  });
};

export const useRecentActivity = (params?: DashboardParams) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['recent-activity', environment, params],
    queryFn: () => dashboardService.getRecentActivity({ ...params, env: environment }),
    staleTime: 15000,
  });
};
