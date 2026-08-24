'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedActionProps {
  /** Permission code to check, e.g. 'station.update' */
  permission?: string;
  /** Role to check, e.g. 'SUPER_ADMIN' */
  role?: string;
  /** Rendered when user lacks access (defaults to null — hidden) */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders children only if the current user has the required permission or role.
 * SUPER_ADMIN always passes all permission checks.
 *
 * @example
 * <ProtectedAction permission="station.update">
 *   <Button>Edit Station</Button>
 * </ProtectedAction>
 */
export function ProtectedAction({
  permission,
  role,
  fallback = null,
  children,
}: ProtectedActionProps) {
  const { hasPermission, hasRole } = useAuth();

  if (permission && !hasPermission(permission)) return <>{fallback}</>;
  if (role && !hasRole(role)) return <>{fallback}</>;

  return <>{children}</>;
}
