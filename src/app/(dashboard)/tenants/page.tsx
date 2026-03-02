import { SuperAdminRoute } from '@/components/shared/AdminRoute';
import { TenantsContainer } from '@/features/tenants/containers/TenantsContainer';

export default function TenantsPage() {
  return (
    <SuperAdminRoute>
      <TenantsContainer />
    </SuperAdminRoute>
  );
}
