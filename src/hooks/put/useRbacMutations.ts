import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rbacService } from '@/services/rbac.service';
import { rbacKeys } from '@/hooks/get/useRbac';
import { toast } from 'sonner';

export const useUpdateUserLocations = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, locationIds }: { userId: string; locationIds: string[] }) =>
      rbacService.updateUserLocations(userId, locationIds),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.userLocations(userId) });
      toast.success('User locations updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user locations');
    },
  });
};
