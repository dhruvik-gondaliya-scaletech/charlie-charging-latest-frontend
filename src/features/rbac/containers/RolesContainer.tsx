'use client';

import { useState } from 'react';
import { Plus, RefreshCw, Shield, Pencil, Trash2, Lock } from 'lucide-react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { Role, AppRole } from '@/types';
import { useRoles } from '@/hooks/get/useRbac';
import { RoleDeleteDialog } from '@/features/rbac/components/RoleDeleteDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { ProtectedAction } from '@/components/shared/ProtectedAction';
import { Table } from '@/components/shared/Table';
import { ActionIconButton } from '@/components/shared/ActionIconButton';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function RolesContainer() {
  const { data: roles, isLoading, isError, refetch } = useRoles();
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const columns: ColumnDef<Role>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Role Name',
      cell: ({ row }) => {
        const formattedName = row.original.name
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        return (
          <div className="flex items-center gap-3">
            <Link
              href={`${FRONTEND_ROUTES.RBAC_ROLE_DETAIL(row.original.id)}?name=${encodeURIComponent(formattedName)}`}
              className="flex items-center gap-3 group/link min-w-0"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate group-hover/link:text-primary transition-colors">
                  {formattedName}
                </p>
                {row.original.description && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {row.original.description}
                  </p>
                )}
              </div>
            </Link>
          </div>
        );
      },
      minSize: 220,
    },
    {
      id: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isSystem ? (
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10 text-amber-500 text-xs gap-1"
            >
              <Lock className="h-3 w-3" />
              System
            </Badge>
          ) : <Badge
            variant="outline"
            className="border-green-500/40 bg-green-500/10 text-green-500 text-xs gap-1"
          >
            <Shield className="h-3 w-3" />
            Custom
          </Badge>}
        </div>
      ),
      minSize: 180,
    },
    {
      id: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => {
        const permCount =
          row.original.permissions?.length ??
          (row.original as Role & { rolePermissions?: unknown[] }).rolePermissions?.length ??
          0;
        return (
          <span className="text-sm text-muted-foreground">
            {permCount} permission{permCount !== 1 ? 's' : ''}
          </span>
        );
      },
      minSize: 130,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const role = row.original;
        if (role.isSystem) {
          return (
            <span className="text-xs text-muted-foreground italic font-medium">
              System roles are read-only
            </span>
          );
        }
        return (
          <div className="flex items-center gap-1">
            <ProtectedAction role={AppRole.SUPER_ADMIN}>
              <ActionIconButton
                tooltip="Edit"
                tone="primary"
                icon={<Pencil className="h-4 w-4" />}
                href={FRONTEND_ROUTES.RBAC_ROLE_EDIT(role.id)}
              />
              <ActionIconButton
                tooltip="Delete"
                tone="destructive"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => setDeleteTarget(role)}
              />
            </ProtectedAction>
          </div>
        );
      },
      minSize: 180,
    },
  ];

  if (isError) {
    return (
      <div className="space-y-8 p-6 lg:p-8">
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-muted-foreground">Failed to load roles. Please try again.</p>
          <Button variant="ghost" onClick={() => refetch()} className="text-muted-foreground">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Roles
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">
            Manage system and custom roles with their permission sets
          </p>
        </div>
        <Link href={FRONTEND_ROUTES.RBAC_ROLE_NEW}>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            New Role
          </Button>
        </Link>
      </div>

      {/* Roles Table */}
      <Table<Role>
        data={roles ?? []}
        columns={columns}
        isLoading={isLoading}
        showSearch
        showPagination={(roles?.length ?? 0) > 10}
        emptyState={
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-foreground/80 font-medium">No roles found</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Create a custom role to get started.
              </p>
            </div>
            <Link href={FRONTEND_ROUTES.RBAC_ROLE_NEW}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </Link>
          </div>
        }
        maxHeight="600px"
      />

      <RoleDeleteDialog
        role={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </div>
  );
}
