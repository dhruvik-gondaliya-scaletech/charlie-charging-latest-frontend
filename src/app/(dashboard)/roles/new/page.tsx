import { RoleCreateContainer } from '@/features/rbac/containers/RoleCreateContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Role | Access Control - Scale EV',
  description: 'Define a new custom role for your organization.',
};

export default function NewRolePage() {
  return <RoleCreateContainer />;
}
