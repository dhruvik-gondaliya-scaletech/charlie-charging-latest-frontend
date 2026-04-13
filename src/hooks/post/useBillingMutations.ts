import { useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService, CreateTariffData } from '@/services/billing.service';
import { toast } from 'sonner';

export const useCreateTariff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTariffData) => billingService.createTariff(data),
    onSuccess: () => {
      toast.success('Tariff created');
      queryClient.invalidateQueries({ queryKey: ['billing-tariffs'] });
    },
    onError: () => {
      toast.error('Failed to create tariff');
    },
  });
};
