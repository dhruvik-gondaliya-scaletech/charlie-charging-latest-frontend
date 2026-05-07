import { useQuery } from '@tanstack/react-query';
import { stationService } from '@/services/station.service';

export const useStationChargingProfile = (stationId: string) => {
  return useQuery({
    queryKey: ['station-charging-profile', stationId],
    queryFn: () => stationService.getStationChargingProfile(stationId),
    enabled: !!stationId,
    staleTime: 30000,
    retry: false, // Don't retry if not found (expected for stations without a limit)
  });
};
