'use client';

import { Shield, Settings, Trash2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Role } from '@/types';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { ProtectedAction } from '@/components/shared/ProtectedAction';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface RoleCardProps {
  role: Role;
  onDelete: (role: Role) => void;
}

export function RoleCard({ role, onDelete }: RoleCardProps) {
  const permCount = role.permissions?.length ?? (role as any).rolePermissions?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative rounded-xl border p-5 transition-all duration-200',
        'bg-white/5 backdrop-blur-sm border-white/10',
        'hover:border-white/20 hover:bg-white/8 hover:shadow-lg hover:shadow-black/20',
      )}
    >
      {/* System badge */}
      {role.isSystem && (
        <div className="absolute right-3 top-3">
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs gap-1"
          >
            <Lock className="h-3 w-3" />
            System
          </Badge>
        </div>
      )}

      {/* Icon + Name */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/8 border border-white/10">
          <Shield className="h-5 w-5 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{role.name}</h3>
          {role.description && (
            <p className="text-sm text-white/50 mt-0.5 line-clamp-1">{role.description}</p>
          )}
        </div>
      </div>

      {/* Role type badge + permission count */}
      <div className="flex items-center justify-between mb-4">
        <RoleBadge role={role.name} size="sm" />
        <span className="text-xs text-white/40">
          {permCount} permission{permCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={FRONTEND_ROUTES.RBAC_ROLE_DETAIL(role.id)} className="flex-1">
          <Button variant="ghost" size="sm" className="w-full text-white/60 hover:text-white">
            View
          </Button>
        </Link>

        <ProtectedAction role="SUPER_ADMIN">
          <Link href={FRONTEND_ROUTES.RBAC_ROLE_EDIT(role.id)}>
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>

          {!role.isSystem && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => onDelete(role)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </ProtectedAction>
      </div>
    </motion.div>
  );
}
