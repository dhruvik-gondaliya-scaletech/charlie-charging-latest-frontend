import { TenantListResponse } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { formatDate } from '@/lib/date';

interface TenantCardProps {
  tenant: TenantListResponse;
}

export function TenantCard({ tenant }: TenantCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-center gap-4">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h3 className="font-semibold">{tenant.name}</h3>
          <p className="text-sm text-muted-foreground">
            Schema: {tenant.schemaName}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {tenant.userCount} users • Created {formatDate(tenant.createdAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={tenant.isActive ? 'default' : 'secondary'}>
          {tenant.isActive ? 'Active' : 'Inactive'}
        </Badge>
        {tenant.isDefault && (
          <Badge variant="outline">Default</Badge>
        )}
      </div>
    </div>
  );
}
