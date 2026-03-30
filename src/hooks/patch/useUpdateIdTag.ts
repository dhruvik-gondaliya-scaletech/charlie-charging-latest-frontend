import { useMutation, useQueryClient } from '@tanstack/react-query';
import { idTagService } from '@/services/id-tag.service';
import { UpdateIdTagData } from '@/types';
import { toast } from 'sonner';

export const useUpdateIdTag = (idTag: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateIdTagData) => idTagService.updateIdTag(idTag, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['id-tags'] });
      queryClient.invalidateQueries({ queryKey: ['id-tag', idTag] });
      toast.success('ID Tag updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update ID tag');
    },
  });
};
