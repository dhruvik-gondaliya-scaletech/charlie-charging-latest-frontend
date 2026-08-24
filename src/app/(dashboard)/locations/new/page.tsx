import { LocationCreateContainer } from '@/features/locations/containers/LocationCreateContainer';
import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { AppPermission } from '@/types';

export const metadata: Metadata = {
  title: 'Define Strategic Site',
  description: 'Add a new charging location to your global network and configure its geographical parameters.',
};

export default function LocationCreatePage() {
    return (
        <ProtectedRoute requiredPermission={AppPermission.LOCATION_CREATE}>
            <LocationCreateContainer />
        </ProtectedRoute>
    );
}
