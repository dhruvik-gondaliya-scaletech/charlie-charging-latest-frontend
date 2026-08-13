'use client';

import Link from 'next/link';
import { ArrowLeft, Settings, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RolePermissionsContainer } from './RolePermissionsContainer';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { useRoleById } from '@/hooks/get/useRbac';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface RoleDetailContainerProps {
  roleId: string;
}

export function RoleDetailContainer({ roleId }: RoleDetailContainerProps) {
  const { data: role, isLoading, isError, refetch } = useRoleById(roleId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground/60">
        <Loader2 className="h-6 w-6 animate-spin mr-3" />
        Loading role details…
      </div>
    );
  }

  if (isError || !role) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">Failed to load role. Please try again.</p>
        <Button variant="ghost" onClick={() => refetch()} className="text-muted-foreground">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const formattedName = role.name.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
      {/* Back */}
      <Link href={FRONTEND_ROUTES.RBAC_ROLES}>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roles
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {formattedName}
            </h1>
            <RoleBadge role={role.name} />
          </div>
          {role.description && (
            <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">
              {role.description}
            </p>
          )}
        </div>
        {!role.isSystem && (
          <Link href={FRONTEND_ROUTES.RBAC_ROLE_EDIT(roleId)}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Settings className="mr-2 h-4 w-4" />
              Edit Role
            </Button>
          </Link>
        )}
      </div>

      {/* Permissions — read-only */}
      <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6">
        <h2 className="text-sm font-semibold text-foreground/70 mb-5">Permissions</h2>
        <RolePermissionsContainer roleId={roleId} editable={false} />
      </div>
    </div>
  );
}
