import { DashboardContainer } from '@/features/dashboard/containers/DashboardContainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of your charging network performance, active sessions, and system health.',
};

export default function DashboardPage() {
  return <DashboardContainer />;
}
