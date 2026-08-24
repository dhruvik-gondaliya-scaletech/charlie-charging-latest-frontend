import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { billingService, Tariff } from '@/services/billing.service';
import { useEnvironment } from '@/contexts/EnvironmentContext';

export type PaginatedTariffs = Tariff[] & {
  meta?: { total: number; page: number; limit: number; totalPages: number };
};

export const useTariffs = (params?: { search?: string; page?: number; limit?: number; locationId?: string }) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['billing-tariffs', environment, params],
    queryFn: async (): Promise<PaginatedTariffs> => {
      const res = await billingService.getTariffs(environment, params);
      if (res && typeof res === 'object') {
        if ('items' in res && Array.isArray((res as any).items)) {
          const list = [...(res as any).items] as PaginatedTariffs;
          list.meta = (res as any).meta;
          return list;
        }
      }
      return (res || []) as PaginatedTariffs;
    },
    staleTime: 60000,
    placeholderData: keepPreviousData,
  });
};
