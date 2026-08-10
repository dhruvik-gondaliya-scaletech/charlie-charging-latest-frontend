import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rbacService } from '@/services/rbac.service';
import { rbacKeys } from '@/hooks/get/useRbac';
import { toast } from 'sonner';

// ─── Delete Role ──────────────────────────────────────────────────────────────

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rbacService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
      toast.success('Role deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete role');
    },
  });
};

// ─── Remove Role from User ────────────────────────────────────────────────────

export const useRemoveRoleFromUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      rbacService.removeRoleFromUser(userId, roleId),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.userRoles(userId) });
      queryClient.invalidateQueries({ queryKey: rbacKeys.userPermissions(userId) });
      toast.success('Role removed successfully');
    },
    onError: () => {
      toast.error('Failed to remove role');
    },
  });
};

// ─── Remove Location from User ────────────────────────────────────────────────

export const useRemoveLocationFromUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, locationId }: { userId: string; locationId: string }) =>
      rbacService.removeLocationFromUser(userId, locationId),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.userLocations(userId) });
      toast.success('Location removed successfully');
    },
    onError: () => {
      toast.error('Failed to remove location');
    },
  });
};
