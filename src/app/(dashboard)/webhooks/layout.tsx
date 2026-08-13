'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AppPermission } from '@/types';

export default function WebhooksLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredPermission={AppPermission.WEBHOOK_READ}>
      {children}
    </ProtectedRoute>
  );
}
