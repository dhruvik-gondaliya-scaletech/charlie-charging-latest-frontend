'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AppPermission, AppRole } from '@/types';

// ─── Permission Codes ────────────────────────────────────────────────────────

export const PERMISSIONS = AppPermission;

export type PermissionCode = AppPermission;

export { AppPermission };

// ─── Roles ───────────────────────────────────────────────────────────────────

export const ROLES = {
  SUPER_ADMIN: AppRole.SUPER_ADMIN,
  ADMIN: AppRole.ADMIN,
  SITE_MANAGER: AppRole.SITE_MANAGER,
  VIEWER: AppRole.VIEWER,
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

// Legacy UserRole enum for compatibility (e.g. middleware, proxy, legacy code)
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

// ─── Permission module groupings (for UI matrix) ─────────────────────────────

export const PERMISSION_MODULES = [
  'location',
  'station',
  'connector',
  'session',
  'ocpp',
  'users',
  'reports',
  'tariff',
  'driver',
  'id_tag',
  'webhook',
  'ocpi',
] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number];

// ─── Permission Utilities ───────────────────────────────────────────────────

/**
 * Flattens module permissions from the API response into a list of AppPermission strings (e.g., 'station.read')
 */
export const flattenModulePermissions = (
  modulePermissions?: Record<string, string[]>
): AppPermission[] => {
  if (!modulePermissions) return [];
  return Object.entries(modulePermissions).flatMap(([moduleName, actions]) =>
    actions.map((action) => `${moduleName}.${action}` as AppPermission)
  );
};

/**
 * Checks if the module permissions map contains a given permission code (e.g., 'station.read')
 */
export const checkModulePermission = (
  modulePermissions: Record<string, string[]> | undefined,
  code: string | AppPermission
): boolean => {
  if (!modulePermissions) return false;
  const parts = code.split('.');
  if (parts.length !== 2) return false;
  const [moduleName, action] = parts;
  return modulePermissions[moduleName]?.includes(action) ?? false;
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

export const useHasPermission = (code: PermissionCode | string): boolean => {
  const { roles, permissions } = useAuth();
  if (roles.includes(ROLES.SUPER_ADMIN)) return true;
  if (roles.includes(ROLES.ADMIN) && code !== AppPermission.TENANTS_READ) return true;
  return permissions.includes(code as AppPermission);
};

/**
 * Returns true if the current user has the given role.
 */
export const useHasRole = (role: RoleName | string): boolean => {
  const { roles } = useAuth();
  return roles.includes(role);
};

/**
 * Returns true if the current user is a SUPER_ADMIN.
 */
export const useIsSuperAdmin = (): boolean => {
  const { roles } = useAuth();
  return roles.includes(ROLES.SUPER_ADMIN);
};

/**
 * Returns true if the current user is ADMIN or SUPER_ADMIN.
 */
export const useIsAdmin = (): boolean => {
  const { roles } = useAuth();
  return roles.includes(ROLES.SUPER_ADMIN) || roles.includes(ROLES.ADMIN);
};

// ─── Legacy helpers (kept for backward compatibility) ────────────────────────

/** @deprecated Use useIsSuperAdmin() hook instead */
export const isSuperAdmin = (userRole: string): boolean =>
  userRole === ROLES.SUPER_ADMIN;

/** @deprecated Use useIsAdmin() hook instead */
export const isAdmin = (userRole: string): boolean =>
  userRole === ROLES.SUPER_ADMIN || userRole === ROLES.ADMIN;

export const canManageStations = (userRole: string): boolean =>
  isAdmin(userRole);

export const canManageUsers = (userRole: string): boolean =>
  isAdmin(userRole);

export const canManageTenants = (userRole: string): boolean =>
  isSuperAdmin(userRole);

export const canViewDashboard = (): boolean => true;

// ─── Role display meta ───────────────────────────────────────────────────────

export const ROLE_META: Record<
  string,
  { label: string; color: string; description: string }
> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    color: 'red',
    description: 'Full platform access across all tenants',
  },
  ADMIN: {
    label: 'Admin',
    color: 'purple',
    description: 'Full tenant access without location restriction',
  },
  SITE_MANAGER: {
    label: 'Site Manager',
    color: 'blue',
    description: 'Manages assigned locations and their stations',
  },
  VIEWER: {
    label: 'Viewer',
    color: 'gray',
    description: 'Read-only access to locations and stations',
  },
};
