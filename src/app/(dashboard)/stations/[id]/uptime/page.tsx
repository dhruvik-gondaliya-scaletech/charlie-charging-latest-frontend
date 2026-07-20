import { ConnectorUptimeContainer } from '@/features/stations/containers/ConnectorUptimeContainer';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    connectorId?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Connector Uptime - Station ${id}`,
    description: 'Detailed compliance and uptime reporting for this connector.',
  };
}

export default async function ConnectorUptimePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { connectorId } = await searchParams;
  return <ConnectorUptimeContainer stationId={id} connectorId={connectorId || ''} />;
}
