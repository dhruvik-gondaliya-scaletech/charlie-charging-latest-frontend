import { LocationsContainer } from '@/features/locations/containers/LocationsContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Locations',
  description: 'Manage your charging site locations and geographic distribution.',
};

export default function LocationsPage() {
  return <LocationsContainer />;
}
