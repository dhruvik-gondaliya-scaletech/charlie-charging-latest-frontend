import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportingService } from '@/services/reporting.service';
import { toast } from 'sonner';

export const useUpdateLocationGroupLocations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupName, locationIds }: { groupName: string; locationIds: string[] }) =>
      reportingService.updateLocationGroupLocations(groupName, locationIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['location-group', variables.groupName] });
      queryClient.invalidateQueries({ queryKey: ['location-groups'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location group updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update location group');
    },
  });
};
