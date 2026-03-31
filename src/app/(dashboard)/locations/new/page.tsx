import { LocationCreateContainer } from '@/features/locations/containers/LocationCreateContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Define Strategic Site',
  description: 'Add a new charging location to your global network and configure its geographical parameters.',
};

export default function LocationCreatePage() {
    return <LocationCreateContainer />;
}
