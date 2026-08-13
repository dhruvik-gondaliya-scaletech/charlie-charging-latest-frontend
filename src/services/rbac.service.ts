import httpService from '@/lib/http-service';
import { API_CONFIG } from '@/constants/constants';
import {
  Role,
  Permission,
  UserRoleAssignment,
  UserLocationAssignment,
  UserEffectivePermissions,
} from '@/types';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface AssignPermissionsDto {
  permissionCodes: string[];
}

export interface AssignRoleDto {
  roleId: string;
}

export interface AssignLocationsDto {
  locationIds: string[];
}

// ─── Service ─────────────────────────────────────────────────────────────────

class RbacService {
  // ── Roles ──────────────────────────────────────────────────────────────────

  async getRoles(): Promise<Role[]> {
    return httpService.get<Role[]>(API_CONFIG.endpoints.rbac.roles);
  }

  async getRoleById(id: string): Promise<Role> {
    return httpService.get<Role>(API_CONFIG.endpoints.rbac.roleById(id));
  }

  async createRole(dto: CreateRoleDto): Promise<Role> {
    return httpService.post<Role>(API_CONFIG.endpoints.rbac.roles, dto);
  }

  async updateRole(id: string, dto: UpdateRoleDto): Promise<Role> {
    return httpService.put<Role>(API_CONFIG.endpoints.rbac.roleById(id), dto);
  }

  async deleteRole(id: string): Promise<void> {
    return httpService.delete(API_CONFIG.endpoints.rbac.roleById(id));
  }

  async assignPermissionsToRole(id: string, permissionCodes: string[]): Promise<Role> {
    return httpService.post<Role>(API_CONFIG.endpoints.rbac.rolePermissions(id), {
      permissionCodes,
    });
  }

  // ── Permissions ────────────────────────────────────────────────────────────

  async getPermissions(): Promise<Permission[]> {
    return httpService.get<Permission[]>(API_CONFIG.endpoints.rbac.permissions);
  }

  // ── User Roles ─────────────────────────────────────────────────────────────

  async getUserRoles(userId: string): Promise<UserRoleAssignment[]> {
    return httpService.get<UserRoleAssignment[]>(
      API_CONFIG.endpoints.rbac.userRoles(userId),
    );
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    return httpService.post(API_CONFIG.endpoints.rbac.userRoles(userId), { roleId });
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    return httpService.delete(API_CONFIG.endpoints.rbac.userRoleById(userId, roleId));
  }

  async getUserRole(userId: string): Promise<UserRoleAssignment> {
    return httpService.get<UserRoleAssignment>(
      API_CONFIG.endpoints.rbac.userRole(userId),
    );
  }

  // ── User Locations ─────────────────────────────────────────────────────────

  async getUserLocations(userId: string): Promise<UserLocationAssignment[]> {
    return httpService.get<UserLocationAssignment[]>(
      API_CONFIG.endpoints.rbac.userLocations(userId),
    );
  }

  async assignLocationsToUser(userId: string, locationIds: string[]): Promise<void> {
    return httpService.post(API_CONFIG.endpoints.rbac.userLocations(userId), {
      locationIds,
    });
  }

  async removeLocationFromUser(userId: string, locationId: string): Promise<void> {
    return httpService.delete(
      API_CONFIG.endpoints.rbac.userLocationById(userId, locationId),
    );
  }

  async updateUserLocations(userId: string, locationIds: string[]): Promise<void> {
    return httpService.put(API_CONFIG.endpoints.rbac.userLocations(userId), {
      locationIds,
    });
  }

  // ── Effective Permissions ──────────────────────────────────────────────────

  async getUserEffectivePermissions(userId: string): Promise<UserEffectivePermissions> {
    return httpService.get<UserEffectivePermissions>(
      API_CONFIG.endpoints.rbac.userPermissions(userId),
    );
  }
}

export const rbacService = new RbacService();
