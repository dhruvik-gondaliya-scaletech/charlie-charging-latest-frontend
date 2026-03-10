import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/brand.service';

export const useConnectorTypes = () => {
    return useQuery({
        queryKey: ['connector-types'],
        queryFn: () => brandService.getConnectorTypes(),
        staleTime: 600000, // 10 minutes
    });
};
