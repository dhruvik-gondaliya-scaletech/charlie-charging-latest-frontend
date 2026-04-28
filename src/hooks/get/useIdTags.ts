import { useQuery } from '@tanstack/react-query';
import { idTagService } from '@/services/id-tag.service';

export const useIdTags = () => {
  return useQuery({
    queryKey: ['id-tags'],
    queryFn: () => idTagService.getAllIdTags(),
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
