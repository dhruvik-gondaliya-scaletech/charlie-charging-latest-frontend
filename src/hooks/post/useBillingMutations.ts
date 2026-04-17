import { useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService, CreateTariffData, UpdateTariffData } from '@/services/billing.service';
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

export const useUpdateTariff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTariffData }) => billingService.updateTariff(id, data),
    onSuccess: () => {
      toast.success('Tariff updated');
      queryClient.invalidateQueries({ queryKey: ['billing-tariffs'] });
    },
    onError: () => {
      toast.error('Failed to update tariff');
    },
  });
};

export const useDeleteTariff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => billingService.deleteTariff(id),
    onSuccess: () => {
      toast.success('Tariff deleted');
      queryClient.invalidateQueries({ queryKey: ['billing-tariffs'] });
    },
    onError: () => {
      toast.error('Failed to delete tariff');
    },
  });
};
