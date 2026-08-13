'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AppPermission } from '@/types';

export default function TenantsLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredPermission={AppPermission.TENANTS_READ}>
      {children}
    </ProtectedRoute>
  );
}
