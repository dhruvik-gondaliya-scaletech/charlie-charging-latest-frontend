import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RolesContainer } from '@/features/rbac/containers/RolesContainer';
import { FRONTEND_ROUTES } from '@/constants/constants';

export const metadata: Metadata = {
  title: 'Roles | Access Control — Charli Charging',
  description: 'Manage RBAC roles and permission assignments for your organization.',
};

export default function RolesPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Shield className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Roles</h1>
            <p className="text-sm text-white/50 mt-0.5">
              Manage system and custom roles with their permission sets
            </p>
          </div>
        </div>
        <Link href={FRONTEND_ROUTES.RBAC_ROLE_NEW}>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Role
          </Button>
        </Link>
      </div>

      {/* Roles grid */}
      <RolesContainer />
    </div>
  );
}
