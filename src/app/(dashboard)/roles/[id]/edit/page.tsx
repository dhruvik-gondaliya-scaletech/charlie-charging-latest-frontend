import { RoleUpdateContainer } from '@/features/rbac/containers/RoleUpdateContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Role | Access Control - Scale EV',
  description: 'Modify role details and configure its permissions matrix.',
};

export default async function EditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RoleUpdateContainer roleId={id} />;
}
