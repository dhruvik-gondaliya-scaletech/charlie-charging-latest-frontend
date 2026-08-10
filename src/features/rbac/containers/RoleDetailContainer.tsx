'use client';

import { useState } from 'react';
import { Loader2, RefreshCw, Save } from 'lucide-react';
import { useRoleById, usePermissions } from '@/hooks/get/useRbac';
import { useAssignPermissionsToRole } from '@/hooks/post/useRbacMutations';
import { PermissionMatrix } from '@/features/rbac/components/PermissionMatrix';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RoleDetailContainerProps {
  roleId: string;
  editable?: boolean;
}

export function RoleDetailContainer({ roleId, editable = false }: RoleDetailContainerProps) {
  const { data: role, isLoading: roleLoading, isError: roleError, refetch } = useRoleById(roleId);
  const { data: allPermissions, isLoading: permsLoading } = usePermissions();
  const assignMutation = useAssignPermissionsToRole();

  const [selectedCodes, setSelectedCodes] = useState<string[] | null>(null);

  // Initialize selected codes from fetched role (only first time)
  const currentCodes = selectedCodes ?? 
    role?.permissions?.map((p) => p.code) ?? 
    (role as any)?.rolePermissions?.map((rp: any) => rp.permission?.code).filter(Boolean) ?? 
    [];

  if (roleLoading || permsLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-white/40">
        <Loader2 className="h-6 w-6 animate-spin mr-3" />
        Loading role details…
      </div>
    );
  }

  if (roleError || !role) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-white/60">Failed to load role. Please try again.</p>
        <Button variant="ghost" onClick={() => refetch()} className="text-white/60">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    if (selectedCodes === null) {
      toast.info('No changes to save');
      return;
    }
    assignMutation.mutate({ id: roleId, permissionCodes: selectedCodes });
  };

  return (
    <div className="space-y-6">
      {editable && !role.isSystem && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/50">
            Toggle permissions then click Save to apply.
          </p>
          <Button
            onClick={handleSave}
            disabled={assignMutation.isPending || selectedCodes === null}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {assignMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Permissions
          </Button>
        </div>
      )}

      {role.isSystem && editable && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          System roles cannot be modified. Permissions are shown in read-only mode.
        </div>
      )}

      <PermissionMatrix
        allPermissions={allPermissions ?? []}
        selected={currentCodes}
        editable={editable && !role.isSystem}
        onChange={(codes) => setSelectedCodes(codes)}
      />
    </div>
  );
}
