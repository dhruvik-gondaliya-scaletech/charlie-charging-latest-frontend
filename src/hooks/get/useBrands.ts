import { useInfiniteQuery } from '@tanstack/react-query';
import { brandService, GetBrandsParams } from '@/services/brand.service';

export const useBrands = (params?: Omit<GetBrandsParams, 'page'>) => {
    return useInfiniteQuery({
        queryKey: ['brands', params],
        queryFn: ({ pageParam = 1 }) =>
            brandService.getAllBrands({ ...params, page: pageParam as number }),
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.meta;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 60000, // 1 minute
    });
};
