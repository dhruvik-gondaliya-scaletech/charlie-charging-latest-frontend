'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FRONTEND_ROUTES } from '@/constants/constants';

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
  const { user, hasRole, hasPermission, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      const loginUrl = `${FRONTEND_ROUTES.LOGIN}?redirect=${encodeURIComponent(currentUrl)}`;
      router.replace(loginUrl);
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      router.replace(redirectTo);
      return;
    }
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.replace(redirectTo);
    }
  }, [loading, user, requiredRole, requiredPermission, hasRole, hasPermission, router, redirectTo, pathname, searchParams]);

  // Don't flash content while loading
  if (loading || !user) return null;

  const allowed =
    (!requiredRole || hasRole(requiredRole)) &&
    (!requiredPermission || hasPermission(requiredPermission));

  if (!allowed) return null;

  return <>{children}</>;
}
