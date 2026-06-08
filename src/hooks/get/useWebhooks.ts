import { useQuery } from '@tanstack/react-query';
import { webhookService, GetWebhookDeliveriesParams } from '@/services/webhook.service';
import { useEnvironment } from '@/contexts/EnvironmentContext';

export const useWebhooks = (name?: string) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['webhooks', environment, name],
    queryFn: () => webhookService.getAll(environment, name),
    staleTime: 30000,
  });
};

export const useWebhook = (id: string) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['webhook', environment, id],
    queryFn: () => webhookService.getById(environment, id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useWebhookSecret = (id: string) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['webhook-secret', environment, id],
    queryFn: () => webhookService.getSecret(environment, id),
    enabled: !!id,
    staleTime: 300000,
  });
};

export const useWebhookDeliveries = (filters?: GetWebhookDeliveriesParams) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['webhook-deliveries', environment, filters],
    queryFn: () => webhookService.getDeliveries(environment, filters),
    staleTime: 15000,
  });
};
