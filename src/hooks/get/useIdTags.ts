import { useQuery } from '@tanstack/react-query';
import { idTagService, IdTagQueryParams } from '@/services/id-tag.service';

export const useIdTags = (params?: IdTagQueryParams) => {
  return useQuery({
    queryKey: ['id-tags', params],
    queryFn: () => idTagService.getAllIdTags(params),
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
