import { Building2 } from 'lucide-react';

export function EmptyTenants() {
  return (
    <div className="text-center py-12">
      <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
      <p className="text-muted-foreground">No tenants found</p>
    </div>
  );
}
