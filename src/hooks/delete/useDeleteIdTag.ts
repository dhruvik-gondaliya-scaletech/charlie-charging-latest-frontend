import { useMutation, useQueryClient } from '@tanstack/react-query';
import { idTagService } from '@/services/id-tag.service';
import { toast } from 'sonner';

export const useDeleteIdTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idTag: string) => idTagService.deleteIdTag(idTag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['id-tags'] });
      toast.success('ID Tag deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete ID tag');
    },
  });
};
