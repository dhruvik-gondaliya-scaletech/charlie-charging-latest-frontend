import { LocationDetailContainer } from "@/features/locations/containers/LocationDetailContainer";
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { API_CONFIG, AUTH_CONFIG } from '@/constants/constants';
import { Location } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_CONFIG.tokenKey)?.value;
    
    // Ensure no double slashes when joining baseUrl and endpoint
    const baseUrl = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl.slice(0, -1) : API_CONFIG.baseUrl;
    const endpoint = API_CONFIG.endpoints.locations.byId(id);
    const url = `${baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      const location: Location = result.data || result;
      return {
        title: location.name,
        description: `Detailed geographic and operational overview for ${location.name}.`,
      };
    }
  } catch (error) {
    console.error('Error fetching location metadata:', error);
  }

  return {
    title: `Location ${id}`,
    description: `Detailed geographic and operational overview for site location ${id}.`,
  };
}

export default function LocationDetailPage() {
  return <LocationDetailContainer />;
}
