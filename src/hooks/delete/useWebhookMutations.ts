import { useMutation, useQueryClient } from '@tanstack/react-query';
import { webhookService } from '@/services/webhook.service';
import { toast } from 'sonner';

export const useDeleteWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => webhookService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete webhook');
    },
  });
};
