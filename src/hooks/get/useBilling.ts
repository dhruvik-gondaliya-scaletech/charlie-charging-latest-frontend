import { useQuery } from '@tanstack/react-query';
import { billingService } from '@/services/billing.service';
import { useEnvironment } from '@/contexts/EnvironmentContext';

export const useTariffs = () => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['billing-tariffs', environment],
    queryFn: () => billingService.getTariffs(environment),
    staleTime: 60000,
  });
};
