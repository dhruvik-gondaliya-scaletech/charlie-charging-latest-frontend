'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Settings, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RolePermissionsContainer } from './RolePermissionsContainer';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { useRoleById } from '@/hooks/get/useRbac';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { BackButton } from '@/components/shared/BackButton';

interface RoleDetailContainerProps {
  roleId: string;
}

export function RoleDetailContainer({ roleId }: RoleDetailContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: role, isLoading, isError, refetch } = useRoleById(roleId);

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

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <BackButton
            href={FRONTEND_ROUTES.RBAC_ROLES}
            label="Return to Roles"
          />
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground uppercase">
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
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Link href={FRONTEND_ROUTES.RBAC_ROLE_EDIT(roleId)}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all uppercase tracking-widest text-xs px-6 py-2">
                <Settings className="mr-2 h-4 w-4" />
                Edit Role
              </Button>
            </Link>
          </div>
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

