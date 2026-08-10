import { useQuery } from '@tanstack/react-query';
import { rbacService } from '@/services/rbac.service';
import { useAuth } from '@/contexts/AuthContext';

// ─── Query key factory ────────────────────────────────────────────────────────

export const rbacKeys = {
  all: ['rbac'] as const,
  roles: () => [...rbacKeys.all, 'roles'] as const,
  role: (id: string) => [...rbacKeys.roles(), id] as const,
  permissions: () => [...rbacKeys.all, 'permissions'] as const,
  userRoles: (userId: string) => [...rbacKeys.all, 'users', userId, 'roles'] as const,
  userLocations: (userId: string) =>
    [...rbacKeys.all, 'users', userId, 'locations'] as const,
  userPermissions: (userId: string) =>
    [...rbacKeys.all, 'users', userId, 'permissions'] as const,
};

// ─── Roles ────────────────────────────────────────────────────────────────────

/** Fetch all roles. Enabled for SUPER_ADMIN and ADMIN. */
export const useRoles = () => {
  const { isSuperAdmin, isAdmin } = useAuth();
  return useQuery({
    queryKey: rbacKeys.roles(),
    queryFn: () => rbacService.getRoles(),
    enabled: isSuperAdmin || isAdmin,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

/** Fetch a single role with its permissions. */
export const useRoleById = (id: string) => {
  const { isSuperAdmin } = useAuth();
  return useQuery({
    queryKey: rbacKeys.role(id),
    queryFn: () => rbacService.getRoleById(id),
    enabled: isSuperAdmin && !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Permissions ─────────────────────────────────────────────────────────────

/** Fetch all 29 system permissions. Enabled only for SUPER_ADMIN. */
export const usePermissions = () => {
  const { isSuperAdmin } = useAuth();
  return useQuery({
    queryKey: rbacKeys.permissions(),
    queryFn: () => rbacService.getPermissions(),
    enabled: isSuperAdmin,
    staleTime: 1000 * 60 * 10, // 10 min — permissions are static
  });
};

// ─── User RBAC ────────────────────────────────────────────────────────────────

/** Fetch roles assigned to a specific user. SUPER_ADMIN only. */
export const useUserRoles = (userId: string) => {
  const { isSuperAdmin } = useAuth();
  return useQuery({
    queryKey: rbacKeys.userRoles(userId),
    queryFn: () => rbacService.getUserRoles(userId),
    enabled: isSuperAdmin && !!userId,
    staleTime: 1000 * 60 * 2,
  });
};

/** Fetch location scope for a specific user. ADMIN + SUPER_ADMIN. */
export const useUserLocations = (userId: string) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: rbacKeys.userLocations(userId),
    queryFn: () => rbacService.getUserLocations(userId),
    enabled: isAdmin && !!userId,
    staleTime: 1000 * 60 * 2,
  });
};

/** Fetch effective (computed) permissions for a user. ADMIN + SUPER_ADMIN. */
export const useUserEffectivePermissions = (userId: string) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: rbacKeys.userPermissions(userId),
    queryFn: () => rbacService.getUserEffectivePermissions(userId),
    enabled: isAdmin && !!userId,
    staleTime: 1000 * 60 * 2,
  });
};
