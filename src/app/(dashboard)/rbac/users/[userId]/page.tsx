'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRbacContainer } from '@/features/rbac/containers/UserRbacContainer';
import { FRONTEND_ROUTES } from '@/constants/constants';

export default function UserRbacPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-8 space-y-8">
      {/* Back */}
      <Link href={FRONTEND_ROUTES.USERS}>
        <Button variant="ghost" size="sm" className="text-white/50 hover:text-white -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/8 border border-white/10">
          <User className="h-6 w-6 text-white/60" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Access Control</h1>
          <p className="text-sm text-white/50 mt-0.5">
            Manage roles and location scope for this user
          </p>
        </div>
      </div>

      {/* RBAC tabs */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <UserRbacContainer userId={userId} />
      </div>
    </div>
  );
}
