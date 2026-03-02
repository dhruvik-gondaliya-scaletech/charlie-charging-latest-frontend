import { useMutation, useQueryClient } from '@tanstack/react-query';
import { locationService, CreateLocationData } from '@/services/location.service';
import { toast } from 'sonner';

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLocationData) => locationService.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create location');
    },
  });
};
