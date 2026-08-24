import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rbacService, UpdateRoleDto } from '@/services/rbac.service';
import { rbacKeys } from '@/hooks/get/useRbac';
import { toast } from 'sonner';

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRoleDto }) =>
      rbacService.updateRole(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.role(id) });
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
      toast.success('Role updated successfully');
    },
    onError: () => {
      toast.error('Failed to update role');
    },
  });
};
