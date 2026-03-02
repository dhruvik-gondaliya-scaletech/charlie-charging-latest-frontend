import { Webhook } from 'lucide-react';

export function EmptyWebhooks() {
  return (
    <div className="text-center py-12">
      <Webhook className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
      <p className="text-muted-foreground">No webhooks configured</p>
    </div>
  );
}
