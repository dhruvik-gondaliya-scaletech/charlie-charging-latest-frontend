import { WebhookConfiguration } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Webhook, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/date';

interface WebhookCardProps {
  webhook: WebhookConfiguration;
  onDelete: (id: string) => void;
}

export function WebhookCard({ webhook, onDelete }: WebhookCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Webhook className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">{webhook.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <ExternalLink className="h-3 w-3" />
              {webhook.url}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={webhook.isActive ? 'default' : 'secondary'}>
            {webhook.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm('Delete this webhook?')) {
                onDelete(webhook.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {webhook.events.map((event, idx) => (
          <Badge key={idx} variant="outline">
            {event}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Created {formatDate(webhook.createdAt)}
      </p>
    </div>
  );
}
