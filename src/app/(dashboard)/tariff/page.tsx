import type { Metadata } from 'next';
import { TariffContainer } from '@/features/billing/containers/TariffContainer';

export const metadata: Metadata = {
  title: 'Tariff',
  description: 'Define pricing rules and manage tariffs used to calculate session costs.',
};

export default function TariffPage() {
  return <TariffContainer />;
}
