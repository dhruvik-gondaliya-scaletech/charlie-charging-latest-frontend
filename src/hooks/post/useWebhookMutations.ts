import { useMutation, useQueryClient } from '@tanstack/react-query';
import { webhookService, CreateWebhookData } from '@/services/webhook.service';
import { toast } from 'sonner';

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWebhookData) => webhookService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create webhook');
    },
  });
};

export const useRetryWebhookDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deliveryId: string) => webhookService.retryDelivery(deliveryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-deliveries'] });
      toast.success('Webhook delivery retried successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to retry webhook delivery');
    },
  });
};
