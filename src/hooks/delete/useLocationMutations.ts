import { useMutation, useQueryClient } from '@tanstack/react-query';
import { locationService } from '@/services/location.service';
import { toast } from 'sonner';

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => locationService.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete location');
    },
  });
};
