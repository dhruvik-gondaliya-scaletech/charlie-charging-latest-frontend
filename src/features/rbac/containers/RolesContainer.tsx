'use client';

import { useState } from 'react';
import { Plus, RefreshCw, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Role } from '@/types';
import { useRoles } from '@/hooks/get/useRbac';
import { RoleCard } from '@/features/rbac/components/RoleCard';
import { RoleDeleteDialog } from '@/features/rbac/components/RoleDeleteDialog';
import { Button } from '@/components/ui/button';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function RolesContainer() {
  const { data: roles, isLoading, isError, refetch } = useRoles();
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-xl border border-white/10 bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-white/60">Failed to load roles. Please try again.</p>
        <Button variant="ghost" onClick={() => refetch()} className="text-white/60">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (!roles?.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20">
          <Shield className="h-8 w-8 text-purple-400" />
        </div>
        <div>
          <p className="text-white/80 font-medium">No roles found</p>
          <p className="text-sm text-white/40 mt-1">
            Create a custom role to get started.
          </p>
        </div>
        <Link href={FRONTEND_ROUTES.RBAC_ROLE_NEW}>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </Link>
      </div>
    );
  }

  // Separate system vs custom roles
  const systemRoles = roles.filter((r) => r.isSystem);
  const customRoles = roles.filter((r) => !r.isSystem);

  return (
    <>
      {/* System Roles */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
          System Roles
        </h2>
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
            hidden: {},
          }}
        >
          {systemRoles.map((role) => (
            <RoleCard key={role.id} role={role} onDelete={setDeleteTarget} />
          ))}
        </motion.div>
      </section>

      {/* Custom Roles */}
      {customRoles.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
            Custom Roles
          </h2>
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {},
            }}
          >
            {customRoles.map((role) => (
              <RoleCard key={role.id} role={role} onDelete={setDeleteTarget} />
            ))}
          </motion.div>
        </section>
      )}

      <RoleDeleteDialog
        role={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </>
  );
}
