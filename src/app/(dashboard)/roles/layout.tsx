'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AppRole } from '@/types';

export default function RbacLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole={AppRole.SUPER_ADMIN}>
      {children}
    </ProtectedRoute>
  );
}
