import { useMutation, useQueryClient } from '@tanstack/react-query';
import { webhookService, UpdateWebhookData } from '@/services/webhook.service';
import { toast } from 'sonner';

export const useUpdateWebhook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateWebhookData }) =>
            webhookService.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['webhooks'] });
            queryClient.invalidateQueries({ queryKey: ['webhook', id] });
            toast.success('Webhook updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update webhook');
        },
    });
};
