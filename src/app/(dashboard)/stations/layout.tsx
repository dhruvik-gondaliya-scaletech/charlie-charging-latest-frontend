'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AppPermission } from '@/types';

export default function StationsLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredPermission={AppPermission.STATION_READ}>
      {children}
    </ProtectedRoute>
  );
}
