import type { Metadata } from 'next';
import { RolesContainer } from '@/features/rbac/containers/RolesContainer';

export const metadata: Metadata = {
  title: 'Roles | Access Control — Charli Charging',
  description: 'Manage RBAC roles and permission assignments for your organization.',
};

export default function RolesPage() {
  return <RolesContainer />;
}
