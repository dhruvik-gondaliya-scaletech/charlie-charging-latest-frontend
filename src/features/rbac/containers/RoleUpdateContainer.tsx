'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleForm } from '@/features/rbac/components/RoleForm';
import { RolePermissionsContainer } from './RolePermissionsContainer';
import { useRoleById } from '@/hooks/get/useRbac';
import { useUpdateRole } from '@/hooks/put/useUpdateRole';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { BackButton } from '@/components/shared/BackButton';
import { cn } from '@/lib/utils';
import type { CreateRoleFormValues } from '@/lib/validations/rbac';

interface RoleUpdateContainerProps {
  roleId: string;
}

export function RoleUpdateContainer({ roleId }: RoleUpdateContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: role, isLoading, isError, refetch } = useRoleById(roleId);
  const updateMutation = useUpdateRole();

  const formattedName = role?.name
    ? role.name
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    : '';

  useEffect(() => {
    if (role && formattedName) {
      if (searchParams.get('name') !== formattedName) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('name', formattedName);
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
  }, [role, formattedName, pathname, searchParams, router]);

  const handleSubmit = (values: CreateRoleFormValues) => {
    updateMutation.mutate(
      { id: roleId, dto: values },
      {
        onSuccess: (data) => {
          const roleName = data?.name || values.name || '';
          const formattedName = roleName.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
          router.push(`${FRONTEND_ROUTES.RBAC_ROLE_DETAIL(roleId)}?name=${encodeURIComponent(formattedName)}`);
        }
      },
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
    <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <BackButton
          href={`${FRONTEND_ROUTES.RBAC_ROLE_DETAIL(roleId)}?name=${encodeURIComponent(formattedName)}`}
          label="Return to Role Details"
        />

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent uppercase">
            Edit
          </h1>
        </div>
      </div>

      {/* Grid Layout for Form & Permissions Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Name/description form */}
        {!role.isSystem && (
          <div className="lg:col-span-1 rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6">
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
        <div className={cn(
          "rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6",
          role.isSystem ? "lg:col-span-3" : "lg:col-span-2"
        )}>
          <h2 className="text-sm font-semibold text-foreground/70 mb-5">Permissions</h2>
          <RolePermissionsContainer roleId={roleId} editable={true} />
        </div>
      </div>
    </div>
  );
}
