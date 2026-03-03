import { WebhookLogsContainer } from '@/features/webhooks/containers/WebhookLogsContainer';

export const metadata = {
    title: 'Webhook Delivery Logs | Charlie Charging',
    description: 'Detailed delivery history and real-time monitoring for webhook event streams.',
};

export default function WebhookLogsPage() {
    return <WebhookLogsContainer />;
}
