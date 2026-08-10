'use client';

import { useAuth } from '@/contexts/AuthContext';

// ─── Permission Codes (mirrors backend PERMISSIONS constant) ─────────────────

export const PERMISSIONS = {
  // Location
  LOCATION_READ: 'location.read',
  LOCATION_CREATE: 'location.create',
  LOCATION_UPDATE: 'location.update',
  LOCATION_DELETE: 'location.delete',
  // Station
  STATION_READ: 'station.read',
  STATION_CREATE: 'station.create',
  STATION_UPDATE: 'station.update',
  STATION_DELETE: 'station.delete',
  // Connector
  CONNECTOR_READ: 'connector.read',
  CONNECTOR_UPDATE: 'connector.update',
  // Session
  SESSION_READ: 'session.read',
  // OCPP
  OCPP_REMOTE_START: 'ocpp.remote_start',
  OCPP_REMOTE_STOP: 'ocpp.remote_stop',
  OCPP_UNLOCK_CONNECTOR: 'ocpp.unlock_connector',
  OCPP_RESET: 'ocpp.reset',
  OCPP_CHANGE_CONFIG: 'ocpp.change_config',
  // Users
  USERS_READ: 'users.read',
  USERS_INVITE: 'users.invite',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_ASSIGN_ROLE: 'users.assign_role',
  USERS_ASSIGN_LOCATION: 'users.assign_location',
  // Reports
  REPORTS_READ: 'reports.read',
  // Tariff
  TARIFF_READ: 'tariff.read',
  TARIFF_CREATE: 'tariff.create',
  TARIFF_UPDATE: 'tariff.update',
  TARIFF_DELETE: 'tariff.delete',
  // Drivers
  DRIVER_READ: 'driver.read',
  DRIVER_CREATE: 'driver.create',
  DRIVER_UPDATE: 'driver.update',

  // ID Tags
  ID_TAG_READ: 'id_tag.read',
  ID_TAG_CREATE: 'id_tag.create',
  ID_TAG_UPDATE: 'id_tag.update',
  ID_TAG_DELETE: 'id_tag.delete',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ─── Roles ───────────────────────────────────────────────────────────────────

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SITE_MANAGER: 'SITE_MANAGER',
  VIEWER: 'VIEWER',
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
] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number];

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Returns true if the current user has the given permission code.
 * SUPER_ADMIN always returns true (backend also bypasses).
 */
export const useHasPermission = (code: PermissionCode | string): boolean => {
  const { roles, permissions } = useAuth();
  if (roles.includes(ROLES.SUPER_ADMIN)) return true;
  return permissions.includes(code);
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
