import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rbacService, UpdateUserRoleLocationDto } from '@/services/rbac.service';
import { rbacKeys } from '@/hooks/get/useRbac';
import { toast } from 'sonner';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserRoleLocationDto }) =>
      rbacService.updateUser(id, dto),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: rbacKeys.userRoles(id) });
      queryClient.invalidateQueries({ queryKey: rbacKeys.userRole(id) });
      queryClient.invalidateQueries({ queryKey: rbacKeys.userLocations(id) });
      queryClient.invalidateQueries({ queryKey: rbacKeys.userPermissions(id) });
      toast.success(data.message || 'User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });
};
