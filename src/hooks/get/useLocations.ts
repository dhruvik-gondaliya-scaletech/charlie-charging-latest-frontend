import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { locationService, GetLocationsParams } from '@/services/location.service';
import { useEnvironment } from '@/contexts/EnvironmentContext';

export const useLocations = (params?: GetLocationsParams) => {
  const { environment } = useEnvironment();
  return useQuery({
    queryKey: ['locations', environment, params],
    queryFn: () => locationService.getAllLocations(environment, params),
    staleTime: 60000,
    placeholderData: keepPreviousData,
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
