import { WebhooksContainer } from '@/features/webhooks/containers/WebhooksContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Webhooks',
  description: 'Configure and monitor real-time event notifications via webhooks.',
};

export default function WebhooksPage() {
  return <WebhooksContainer />;
}
