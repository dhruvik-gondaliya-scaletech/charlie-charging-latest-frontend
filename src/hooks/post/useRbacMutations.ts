import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rbacService, CreateRoleDto } from '@/services/rbac.service';
import { rbacKeys } from '@/hooks/get/useRbac';
import { toast } from 'sonner';

// ─── Create Role ──────────────────────────────────────────────────────────────

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateRoleDto) => rbacService.createRole(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
      toast.success('Role created successfully');
    },
    onError: () => {
      toast.error('Failed to create role');
    },
  });
};

// ─── Assign Permissions to Role ───────────────────────────────────────────────

export const useAssignPermissionsToRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permissionCodes }: { id: string; permissionCodes: string[] }) =>
      rbacService.assignPermissionsToRole(id, permissionCodes),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.role(id) });
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
      toast.success('Permissions updated successfully');
    },
    onError: () => {
      toast.error('Failed to update permissions');
    },
  });
};

// ─── Assign Role to User ──────────────────────────────────────────────────────

export const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      rbacService.assignRoleToUser(userId, roleId),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.userRoles(userId) });
      queryClient.invalidateQueries({ queryKey: rbacKeys.userPermissions(userId) });
      toast.success('Role assigned successfully');
    },
    onError: () => {
      toast.error('Failed to assign role');
    },
  });
};

// ─── Assign Locations to User ─────────────────────────────────────────────────

export const useAssignLocationsToUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, locationIds }: { userId: string; locationIds: string[] }) =>
      rbacService.assignLocationsToUser(userId, locationIds),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.userLocations(userId) });
      toast.success('Locations assigned successfully');
    },
    onError: () => {
      toast.error('Failed to assign locations');
    },
  });
};
