import { ReportsContainer } from '@/features/reports/containers/ReportsContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports & Group Management',
  description: 'Configure and export reporting event data and manage location group assignments.',
};

export default function ReportsPage() {
  return <ReportsContainer />;
}
