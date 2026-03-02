import { TenantListResponse } from '@/types';
import { TenantCard } from './TenantCard';

interface TenantListProps {
  tenants: TenantListResponse[];
}

export function TenantList({ tenants }: TenantListProps) {
  return (
    <div className="space-y-4">
      {tenants.map((tenant) => (
        <TenantCard key={tenant.id} tenant={tenant} />
      ))}
    </div>
  );
}
