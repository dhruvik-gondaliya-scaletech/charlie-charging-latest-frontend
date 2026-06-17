import { useQuery } from '@tanstack/react-query';
import { complianceService } from '@/services/compliance.service';

export const useConnectorUptime = (connectorId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['compliance-uptime', connectorId, startDate, endDate],
    queryFn: () => complianceService.calculateUptime(connectorId, startDate, endDate),
    enabled: !!connectorId && !!startDate && !!endDate,
    staleTime: 30000,
  });
};

export const useDowntimeIntervals = (connectorId?: string, limit?: number, offset?: number) => {
  return useQuery({
    queryKey: ['compliance-downtime-intervals', connectorId, limit, offset],
    queryFn: () => complianceService.getDowntimeIntervals(connectorId, limit, offset),
    staleTime: 15000,
  });
};

export const useComplianceReport = (
  type: 'daily' | 'monthly' | 'quarterly',
  startDate: string,
  endDate: string,
  params?: { connectorId?: string; stationId?: string },
) => {
  return useQuery({
    queryKey: ['compliance-report', type, startDate, endDate, params],
    queryFn: () => {
      switch (type) {
        case 'daily':
          return complianceService.getDailyReport(startDate, endDate, params);
        case 'monthly':
          return complianceService.getMonthlyReport(startDate, endDate, params);
        case 'quarterly':
          return complianceService.getQuarterlyReport(startDate, endDate, params);
        default:
          throw new Error(`Invalid report type: ${type}`);
      }
    },
    enabled: !!startDate && !!endDate && (!!params?.connectorId || !!params?.stationId),
    staleTime: 60000,
  });
};
