import { useQuery } from '@tanstack/react-query';
import { billingService } from '@/services/billing.service';

export const useTariffs = () => {
  return useQuery({
    queryKey: ['billing-tariffs'],
    queryFn: () => billingService.getTariffs(),
    staleTime: 60000,
  });
};
