'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleDetailContainer } from '@/features/rbac/containers/RoleDetailContainer';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { useRoleById } from '@/hooks/get/useRbac';
import { FRONTEND_ROUTES } from '@/constants/constants';

export default function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: role } = useRoleById(id);

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-8 space-y-8">
      {/* Back */}
      <Link href={FRONTEND_ROUTES.RBAC_ROLES}>
        <Button variant="ghost" size="sm" className="text-white/50 hover:text-white -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roles
        </Button>
      </Link>

      {/* Header */}
      {role && (
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-white">{role.name}</h1>
              <RoleBadge role={role.name} />
            </div>
            {role.description && (
              <p className="text-sm text-white/50">{role.description}</p>
            )}
          </div>
          {!role.isSystem && (
            <Link href={FRONTEND_ROUTES.RBAC_ROLE_EDIT(id)}>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Settings className="mr-2 h-4 w-4" />
                Edit Role
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Permissions — read-only */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h2 className="text-sm font-semibold text-white/70 mb-5">Permissions</h2>
        <RoleDetailContainer roleId={id} editable={false} />
      </div>
    </div>
  );
}
