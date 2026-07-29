import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/location.service';
import { useEnvironment } from '@/contexts/EnvironmentContext';

export const useLocations = (params?: { name?: string }) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['locations', environment, params],
    queryFn: () => locationService.getAllLocations(environment, params),
    staleTime: 60000,
  });
};

export const useLocation = (id: string) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['location', environment, id],
    queryFn: () => locationService.getLocationById(environment, id),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useLocationStatistics = (
  id: string,
  params?: { period?: string; timezone?: string },
) => {
  return useQuery({
    queryKey: ['location-statistics', id, params],
    queryFn: () => locationService.getLocationStatistics(id, params || {}),
    enabled: !!id,
    staleTime: 60000,
  });
};
