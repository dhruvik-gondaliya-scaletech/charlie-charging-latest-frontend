import { useMutation, useQueryClient } from '@tanstack/react-query';
import { locationService, UpdateLocationData } from '@/services/location.service';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { toast } from 'sonner';

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  const { environment } = useEnvironment();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLocationData }) =>
      locationService.updateLocation(environment, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location', variables.id] });
      toast.success('Location updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update location');
    },
  });
};
