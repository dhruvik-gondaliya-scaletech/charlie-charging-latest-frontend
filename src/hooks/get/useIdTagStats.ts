import { useQuery } from '@tanstack/react-query';
import { idTagService, IdTagStats } from '@/services/id-tag.service';

export const useIdTagStats = () => {
  return useQuery<IdTagStats>({
    queryKey: ['id-tag-stats'],
    queryFn: async (): Promise<IdTagStats> => {
      const res = await idTagService.getIdTagStats();
      return res || { total: 0, active: 0, blocked: 0 };
    },
    staleTime: 30000,
  });
};
