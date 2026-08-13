'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AppPermission } from '@/types';

export default function TariffLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredPermission={AppPermission.TARIFF_READ}>
      {children}
    </ProtectedRoute>
  );
}
