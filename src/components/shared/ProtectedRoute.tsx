'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  /** Required role — redirects to /unauthorized if user lacks it */
  requiredRole?: string;
  /** Required permission code */
  requiredPermission?: string;
  /** Custom redirect path (default: /unauthorized) */
  redirectTo?: string;
  children: ReactNode;
}

/**
 * Layout-level route guard. Redirects to /unauthorized when the current
 * user lacks the required role or permission.
 *
 * Usage in layout.tsx:
 * <ProtectedRoute requiredRole="SUPER_ADMIN">
 *   {children}
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  requiredRole,
  requiredPermission,
  redirectTo = '/unauthorized',
  children,
}: ProtectedRouteProps) {
  const { hasRole, hasPermission, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (requiredRole && !hasRole(requiredRole)) {
      router.replace(redirectTo);
      return;
    }
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.replace(redirectTo);
    }
  }, [loading, requiredRole, requiredPermission, hasRole, hasPermission, router, redirectTo]);

  // Don't flash content while loading
  if (loading) return null;

  const allowed =
    (!requiredRole || hasRole(requiredRole)) &&
    (!requiredPermission || hasPermission(requiredPermission));

  if (!allowed) return null;

  return <>{children}</>;
}
