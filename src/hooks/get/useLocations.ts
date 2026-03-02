import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/location.service';

export const useLocations = (params?: { name?: string }) => {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => locationService.getAllLocations(params),
    staleTime: 60000,
  });
};

export const useLocation = (id: string) => {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => locationService.getLocationById(id),
    enabled: !!id,
    staleTime: 60000,
  });
};
