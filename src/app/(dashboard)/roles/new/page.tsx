'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleForm } from '@/features/rbac/components/RoleForm';
import { useCreateRole } from '@/hooks/post/useRbacMutations';
import { FRONTEND_ROUTES } from '@/constants/constants';
import type { CreateRoleFormValues } from '@/lib/validations/rbac';

export default function NewRolePage() {
  const router = useRouter();
  const createMutation = useCreateRole();

  const handleSubmit = (values: CreateRoleFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => router.push(FRONTEND_ROUTES.RBAC_ROLES),
    });
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground -ml-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Roles
      </Button>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Role</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
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
