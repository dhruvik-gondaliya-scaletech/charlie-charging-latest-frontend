'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleForm } from '@/features/rbac/components/RoleForm';
import { RoleDetailContainer } from '@/features/rbac/containers/RoleDetailContainer';
import { useRoleById } from '@/hooks/get/useRbac';
import { useUpdateRole } from '@/hooks/put/useUpdateRole';
import { FRONTEND_ROUTES } from '@/constants/constants';
import type { CreateRoleFormValues } from '@/lib/validations/rbac';

export default function EditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: role } = useRoleById(id);
  const updateMutation = useUpdateRole();

  const handleSubmit = (values: CreateRoleFormValues) => {
    updateMutation.mutate(
      { id, dto: values },
      { onSuccess: () => router.push(FRONTEND_ROUTES.RBAC_ROLE_DETAIL(id)) },
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-8 space-y-8">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="text-white/50 hover:text-white -ml-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-xl font-bold text-white">Edit Role</h1>
        {role?.description && (
          <p className="text-sm text-white/50 mt-1">{role.description}</p>
        )}
      </div>

      {/* Name/description form */}
      {!role?.isSystem && (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <h2 className="text-sm font-semibold text-white/70 mb-5">Role Details</h2>
          <RoleForm
            mode="edit"
            defaultValues={{ name: role?.name, description: role?.description ?? '' }}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </div>
      )}

      {/* Permissions matrix */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h2 className="text-sm font-semibold text-white/70 mb-5">Permissions</h2>
        <RoleDetailContainer roleId={id} editable={true} />
      </div>
    </div>
  );
}
