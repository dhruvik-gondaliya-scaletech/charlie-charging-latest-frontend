import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/brand.service';

export const useModels = (brandId?: number) => {
    return useQuery({
        queryKey: ['models', brandId],
        queryFn: () => brandService.getModelsByBrand(brandId!),
        enabled: !!brandId,
        staleTime: 60000, // 1 minute
    });
};
