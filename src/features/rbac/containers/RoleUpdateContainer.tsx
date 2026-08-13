'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleForm } from '@/features/rbac/components/RoleForm';
import { RolePermissionsContainer } from './RolePermissionsContainer';
import { useRoleById } from '@/hooks/get/useRbac';
import { useUpdateRole } from '@/hooks/put/useUpdateRole';
import { FRONTEND_ROUTES } from '@/constants/constants';
import type { CreateRoleFormValues } from '@/lib/validations/rbac';

interface RoleUpdateContainerProps {
  roleId: string;
}

export function RoleUpdateContainer({ roleId }: RoleUpdateContainerProps) {
  const router = useRouter();
  const { data: role, isLoading, isError, refetch } = useRoleById(roleId);
  const updateMutation = useUpdateRole();

  const handleSubmit = (values: CreateRoleFormValues) => {
    updateMutation.mutate(
      { id: roleId, dto: values },
      { onSuccess: () => router.push(FRONTEND_ROUTES.RBAC_ROLE_DETAIL(roleId)) },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground/60">
        <Loader2 className="h-6 w-6 animate-spin mr-3" />
        Loading role...
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

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground -ml-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Edit Role
        </h1>
        {role.description && (
          <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">
            {role.description}
          </p>
        )}
      </div>

      {/* Name/description form */}
      {!role.isSystem && (
        <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6">
          <h2 className="text-sm font-semibold text-foreground/70 mb-5">Role Details</h2>
          <RoleForm
            mode="edit"
            defaultValues={{ name: role.name, description: role.description ?? '' }}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </div>
      )}

      {/* Permissions matrix */}
      <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6">
        <h2 className="text-sm font-semibold text-foreground/70 mb-5">Permissions</h2>
        <RolePermissionsContainer roleId={roleId} editable={true} />
      </div>
    </div>
  );
}
