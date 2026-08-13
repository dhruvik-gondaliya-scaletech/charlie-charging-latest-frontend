import { RoleDetailContainer } from '@/features/rbac/containers/RoleDetailContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Role Details | Access Control - Scale EV',
  description: 'View custom role assignments and permissions configuration.',
};

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RoleDetailContainer roleId={id} />;
}
