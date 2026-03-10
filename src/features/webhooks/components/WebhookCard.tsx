import { WebhookConfiguration } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Webhook, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

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
          <Badge
            variant="outline"
            className={cn(
              'capitalize font-bold px-2.5 py-0.5 rounded-full border shadow-sm',
              webhook.isActive
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                : 'bg-destructive/10 text-destructive border-destructive/20'
            )}
          >
            {webhook.isActive ? 'active' : 'inactive'}
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
          <Badge
            key={idx}
            variant="outline"
            className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide"
          >
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
