import { TenantsContainer } from '@/features/tenants/containers/TenantsContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tenant Management',
  description: 'Global administration of platform tenants and organizations.',
};

export default function TenantsPage() {
  return <TenantsContainer />;
}
