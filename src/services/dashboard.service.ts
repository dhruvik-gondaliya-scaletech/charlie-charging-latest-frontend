import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import { DashboardData, DashboardStats, RecentActivity } from '@/types';

export interface DashboardParams {
  limit?: number;
  stationId?: string;
  startDate?: string;
  endDate?: string;
  fromDate?: string;
  toDate?: string;
  env?: string;
}

class DashboardService {
  async getDashboardData(params?: DashboardParams) {
    return httpService.get<DashboardData>(API_CONFIG.endpoints.dashboard.base, { params });
  }

  async getDashboardStats(params?: DashboardParams) {
    return httpService.get<DashboardStats>(API_CONFIG.endpoints.dashboard.stats, {
      params,
    });
  }

  async getRecentActivity(params?: DashboardParams) {
    return httpService.get<any[]>(API_CONFIG.endpoints.dashboard.activity, { params });
  }
}

export const dashboardService = new DashboardService();
