import { useQuery } from '@tanstack/react-query';
import { webhookService, GetWebhookDeliveriesParams } from '@/services/webhook.service';

export const useWebhooks = (name?: string) => {
  return useQuery({
    queryKey: ['webhooks', name],
    queryFn: () => webhookService.getAll(name),
    staleTime: 30000,
  });
};

export const useWebhook = (id: string) => {
  return useQuery({
    queryKey: ['webhook', id],
    queryFn: () => webhookService.getById(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useWebhookSecret = (id: string) => {
  return useQuery({
    queryKey: ['webhook-secret', id],
    queryFn: () => webhookService.getSecret(id),
    enabled: !!id,
    staleTime: 300000,
  });
};

export const useWebhookDeliveries = (filters?: GetWebhookDeliveriesParams) => {
  return useQuery({
    queryKey: ['webhook-deliveries', filters],
    queryFn: () => webhookService.getDeliveries(filters),
    staleTime: 15000,
  });
};
