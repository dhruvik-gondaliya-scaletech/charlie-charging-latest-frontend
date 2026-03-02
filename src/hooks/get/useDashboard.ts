import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardParams } from '@/services/dashboard.service';

export const useDashboardData = (params?: DashboardParams) => {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => dashboardService.getDashboardData(params),
    staleTime: 30000,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getDashboardStats(),
    staleTime: 30000,
  });
};

export const useRecentActivity = (params?: DashboardParams) => {
  return useQuery({
    queryKey: ['recent-activity', params],
    queryFn: () => dashboardService.getRecentActivity(params),
    staleTime: 15000,
  });
};
