import { UsersContainer } from '@/features/users/containers/UsersContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Manage user access, roles, and permissions within your organization.',
};

export default function UsersPage() {
  return <UsersContainer />;
}
