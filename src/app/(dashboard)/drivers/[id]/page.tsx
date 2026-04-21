import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { API_CONFIG, AUTH_CONFIG } from '@/constants/constants';
import { Driver } from '@/types';
import { DriverSessionsContainer } from '@/features/drivers/containers/DriverDetailContainer';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_CONFIG.tokenKey)?.value;

    const baseUrl = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl.slice(0, -1) : API_CONFIG.baseUrl;
    const endpoint = API_CONFIG.endpoints.drivers.byId(id);
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      const driver: Driver = result.data || result;
      return {
        title: `${driver.firstName} ${driver.lastName} - Sessions | CSMS`,
        description: `Historical charging session data and intelligence for driver ${driver.firstName} ${driver.lastName}.`,
      };
    }
  } catch (error) {
    console.error('Error fetching driver metadata:', error);
  }

  return {
    title: `Driver Sessions - ${id} | CSMS`,
    description: `Historical charging session data and intelligence for driver ${id}.`,
  };
}

export default function DriverSessionsPage() {
  return <DriverSessionsContainer />;
}
