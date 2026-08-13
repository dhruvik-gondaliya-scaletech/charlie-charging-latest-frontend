'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function RbacLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      {children}
    </ProtectedRoute>
  );
}
