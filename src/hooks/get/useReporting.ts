import { useQuery } from '@tanstack/react-query';
import { reportingService } from '@/services/reporting.service';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import type { IntervalReportQuery } from '@/types/reporting.types';

/**
 * Fetches flat per-session interval slices.
 * Query is disabled when no params are explicitly triggered.
 */
export const useIntervalReport = (params?: IntervalReportQuery, enabled = false) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['interval-report', environment, params],
    queryFn: () => reportingService.getIntervalReport({ ...params, env: environment }),
    staleTime: 60_000,
    enabled,
  });
};

/**
 * Fetches aggregated demand (one row per clock block) across all sessions.
 * Query is disabled when no params are explicitly triggered.
 */
export const useAggregatedIntervalReport = (params?: IntervalReportQuery, enabled = false) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['aggregated-interval-report', environment, params],
    queryFn: () => reportingService.getAggregatedIntervalReport({ ...params, env: environment }),
    staleTime: 60_000,
    enabled,
  });
};
