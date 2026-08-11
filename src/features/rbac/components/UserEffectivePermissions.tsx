'use client';

import { Loader2, Shield, Info } from 'lucide-react';
import { PermissionBadge } from '@/components/shared/PermissionBadge';

interface UserEffectivePermissionsProps {
  permissions: string[];
  isLoading?: boolean;
}

export function UserEffectivePermissions({
  permissions,
  isLoading,
}: UserEffectivePermissionsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-white/40">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Computing permissions…
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <Shield className="h-10 w-10 text-white/20" />
        <p className="text-sm text-white/50">No permissions found.</p>
        <p className="text-xs text-white/30">Assign a role to grant permissions.</p>
      </div>
    );
  }

  // Group by module for organized display
  const grouped = permissions.reduce<Record<string, string[]>>((acc, code) => {
    const module = code.split('.')[0];
    acc[module] = [...(acc[module] ?? []), code];
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          These are the effective permissions granted by all assigned roles combined.
        </span>
      </div>

      {/* Permission chips grouped by module */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([module, codes]) => (
          <div key={module}>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
              {module}
            </p>
            <div className="flex flex-wrap gap-2">
              {codes.map((code) => (
                <PermissionBadge key={code} code={code} size="md" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total count */}
      <p className="text-right text-xs text-white/30">
        {permissions.length} total permission{permissions.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
