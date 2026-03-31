import { StationsContainer } from '@/features/stations/containers/StationsContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Charging Stations',
  description: 'Monitor and manage your network of electric vehicle charging stations.',
};

export default function StationsPage() {
  return <StationsContainer />;
}
