import { useQuery } from '@tanstack/react-query';
import { idTagService, IdTagQueryParams } from '@/services/id-tag.service';
import { IdTag } from '@/types';

export type PaginatedIdTags = IdTag[] & {
  meta?: { total: number; page: number; limit: number; totalPages: number };
};

export const useIdTags = (params?: IdTagQueryParams) => {
  return useQuery({
    queryKey: ['id-tags', params],
    queryFn: async (): Promise<PaginatedIdTags> => {
      const res = await idTagService.getAllIdTags(params);
      if (res && typeof res === 'object') {
        if ('items' in res && Array.isArray((res as any).items)) {
          const list = [...(res as any).items] as PaginatedIdTags;
          list.meta = (res as any).meta;
          return list;
        }
        if ('data' in res && Array.isArray((res as any).data)) {
          const list = [...(res as any).data] as PaginatedIdTags;
          list.meta = (res as any).meta;
          return list;
        }
      }
      return (res || []) as PaginatedIdTags;
    },
    staleTime: 30000,
  });
};

export const useIdTag = (idTag: string) => {
  return useQuery({
    queryKey: ['id-tag', idTag],
    queryFn: () => idTagService.getIdTagById(idTag),
    enabled: !!idTag,
    staleTime: 30000,
  });
};
