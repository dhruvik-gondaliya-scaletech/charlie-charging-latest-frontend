import { StationDetailContainer } from '@/features/stations/containers/StationDetailContainer';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { API_CONFIG, AUTH_CONFIG } from '@/constants/constants';
import { Station } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_CONFIG.tokenKey)?.value;

    // Ensure no double slashes when joining baseUrl and endpoint
    const baseUrl = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl.slice(0, -1) : API_CONFIG.baseUrl;
    const endpoint = API_CONFIG.endpoints.stations.byId(id);
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      const station: Station = result.data || result;
      return {
        title: station.name,
        description: `Detailed information, real-time diagnostics, and configuration for charging station ${station.name}.`,
      };
    }
  } catch (error) {
    console.error('Error fetching station metadata:', error);
  }

  return {
    title: `Station ${id}`,
    description: `Detailed information, real-time diagnostics, and configuration for charging station ${id}.`,
  };
}

export default function StationDetailPage() {
    return <StationDetailContainer />;
}
