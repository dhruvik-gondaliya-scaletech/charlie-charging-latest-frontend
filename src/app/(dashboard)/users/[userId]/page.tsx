'use client';

import { use } from 'react';
import { UserRbacContainer } from '@/features/rbac/containers/UserRbacContainer';

export default function UserRbacPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);

  return <UserRbacContainer userId={userId} />;
}
