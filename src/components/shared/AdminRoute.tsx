'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin, isSuperAdmin } from '@/lib/permissions';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user || !isAdmin(user.role))) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !isAdmin(user.role)) {
    return null;
  }

  return <>{children}</>;
}

export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user || !isSuperAdmin(user.role))) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !isSuperAdmin(user.role)) {
    return null;
  }

  return <>{children}</>;
}
