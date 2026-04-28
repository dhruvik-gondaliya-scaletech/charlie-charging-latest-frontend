import { DriversContainer } from '@/features/drivers/containers/DriversContainer';

export const metadata = {
  title: 'Driver Management | CSMS',
  description: 'Manage charging network drivers and their access credentials.',
};

export default function DriversPage() {
  return <DriversContainer />;
}
