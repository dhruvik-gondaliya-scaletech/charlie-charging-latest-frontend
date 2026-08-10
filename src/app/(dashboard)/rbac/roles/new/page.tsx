'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
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
    <div className="max-w-lg mx-auto p-6 lg:p-8 space-y-8">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="text-white/50 hover:text-white -ml-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Roles
      </Button>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20">
          <Plus className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Create Role</h1>
          <p className="text-sm text-white/50">
            Define a new custom role for your organization
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <RoleForm
          mode="create"
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  );
}
