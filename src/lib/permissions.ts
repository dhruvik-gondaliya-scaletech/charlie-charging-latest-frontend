export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export const hasRole = (userRole: string, requiredRole: UserRole): boolean => {
  const roleHierarchy = {
    [UserRole.SUPER_ADMIN]: 3,
    [UserRole.ADMIN]: 2,
    [UserRole.USER]: 1,
  };

  return (roleHierarchy[userRole as UserRole] || 0) >= (roleHierarchy[requiredRole] || 0);
};

export const isSuperAdmin = (userRole: string): boolean => {
  return userRole === UserRole.SUPER_ADMIN;
};

export const isAdmin = (userRole: string): boolean => {
  return hasRole(userRole, UserRole.ADMIN);
};

export const canManageStations = (userRole: string): boolean => {
  return hasRole(userRole, UserRole.ADMIN);
};

export const canManageUsers = (userRole: string): boolean => {
  return hasRole(userRole, UserRole.ADMIN);
};

export const canManageTenants = (userRole: string): boolean => {
  return isSuperAdmin(userRole);
};

export const canViewDashboard = (userRole: string): boolean => {
  return hasRole(userRole, UserRole.USER);
};
