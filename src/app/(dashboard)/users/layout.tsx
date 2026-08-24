'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AppPermission } from '@/types';

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredPermission={AppPermission.USERS_READ}>
      {children}
    </ProtectedRoute>
  );
}
