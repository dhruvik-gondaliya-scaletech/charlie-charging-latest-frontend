import { useMutation, useQueryClient } from '@tanstack/react-query';
import { idTagService } from '@/services/id-tag.service';
import { CreateIdTagData } from '@/types';
import { toast } from 'sonner';

export const useCreateIdTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIdTagData) => idTagService.createIdTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['id-tags'] });
      toast.success('ID Tag created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create ID tag');
    },
  });
};
