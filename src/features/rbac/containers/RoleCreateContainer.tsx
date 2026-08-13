'use client';

import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { RoleForm } from '@/features/rbac/components/RoleForm';
import { useCreateRole } from '@/hooks/post/useRbacMutations';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { BackButton } from '@/components/shared/BackButton';
import type { CreateRoleFormValues } from '@/lib/validations/rbac';

export function RoleCreateContainer() {
  const router = useRouter();
  const createMutation = useCreateRole();

  const handleSubmit = (values: CreateRoleFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => router.push(FRONTEND_ROUTES.RBAC_ROLES),
    });
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Back */}
      <BackButton
        label="Return to Roles"
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Create Role
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">
            Define a new custom role for your organization
          </p>
        </div>
      </div>

      {/* Form */}
      <RoleForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
