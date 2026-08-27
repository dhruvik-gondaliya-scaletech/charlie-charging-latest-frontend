'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_CONFIG, FRONTEND_ROUTES, Environment } from '@/constants/constants';
import { User, Tenant, AppPermission, AppRole, TenantMembership } from '@/types';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { useMe } from '@/hooks/get/useMe';
import { flattenModulePermissions } from '@/lib/permissions';
import { isSiteManagerUser, useEnvironment } from '@/contexts/EnvironmentContext';

interface LoginResult {
  requiresTenantSelection?: boolean;
  tenants?: TenantMembership[];
}

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult | void>;
  googleLogin: (idToken: string, tenantId?: string) => Promise<LoginResult | void>;
  selectTenant: (email: string, password: string, tenantId: string) => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  // RBAC fields
  roles: string[];
  permissions: AppPermission[];
  locationScope: string[];          // empty = unrestricted (ADMIN / SUPER_ADMIN)
  hasPermission: (code: AppPermission | string) => boolean;
  hasRole: (role: string) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  tenant: null,
  loading: true,
  login: async () => {},
  googleLogin: async () => {},
  selectTenant: async () => {},
  switchTenant: async () => {},
  logout: () => {},
  isAuthenticated: false,
  roles: [],
  permissions: [],
  locationScope: [],
  hasPermission: () => false,
  hasRole: () => false,
  isSuperAdmin: false,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const extractRbacFromUser = (user: User | null) => {
  const roles = user?.roles ?? (user?.role ? [user.role] : []);
  const permissions = user?.modulePermissions
    ? flattenModulePermissions(user.modulePermissions)
    : (user?.permissions ?? []);

  return {
    roles,
    permissions,
    locationScope: user?.locations ?? [],
  };
};

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setEnvironment } = useEnvironment();

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
      const storedUser = localStorage.getItem(AUTH_CONFIG.userKey);
      const storedTenant = localStorage.getItem(AUTH_CONFIG.tenantKey);

      if (token && storedUser && storedTenant) {
        try {
          const userData = JSON.parse(storedUser);
          const tenantData = JSON.parse(storedTenant);

          if (isSiteManagerUser(userData)) {
            localStorage.setItem('active_environment', Environment.PROD);
            setEnvironment(Environment.PROD);
          }

          // Sync cookies with localStorage for middleware
          document.cookie = `${AUTH_CONFIG.tokenKey}=${token}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `${AUTH_CONFIG.userKey}=${encodeURIComponent(storedUser)}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `${AUTH_CONFIG.tenantKey}=${encodeURIComponent(storedTenant)}; path=/; max-age=86400; SameSite=Lax`;

          setUser(userData);
          setTenant(tenantData);
        } catch (error) {
          console.error('Error parsing stored auth data:', error);
          localStorage.removeItem(AUTH_CONFIG.tokenKey);
          localStorage.removeItem(AUTH_CONFIG.userKey);
          localStorage.removeItem(AUTH_CONFIG.tenantKey);
          document.cookie = `${AUTH_CONFIG.tokenKey}=; path=/; max-age=0`;
          document.cookie = `${AUTH_CONFIG.userKey}=; path=/; max-age=0`;
          document.cookie = `${AUTH_CONFIG.tenantKey}=; path=/; max-age=0`;
        }
      }

      setLoading(false);
    };

    initAuth();
  }, [setEnvironment]);

  const getRedirectTarget = (): string => {
    if (typeof window === 'undefined') return FRONTEND_ROUTES.DASHBOARD;
    const searchParams = new URLSearchParams(window.location.search);
    const redirectParam = searchParams.get('redirect');
    if (redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
      return redirectParam;
    }
    return FRONTEND_ROUTES.DASHBOARD;
  };

  const storeSession = (token: string, fullUser: User, tenantData: Tenant) => {
    localStorage.setItem(AUTH_CONFIG.tokenKey, token);
    localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(fullUser));
    localStorage.setItem(AUTH_CONFIG.tenantKey, JSON.stringify(tenantData));

    if (isSiteManagerUser(fullUser)) {
      localStorage.setItem('active_environment', Environment.PROD);
      setEnvironment(Environment.PROD);
    }

    document.cookie = `${AUTH_CONFIG.tokenKey}=${token}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `${AUTH_CONFIG.userKey}=${encodeURIComponent(JSON.stringify(fullUser))}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `${AUTH_CONFIG.tenantKey}=${encodeURIComponent(JSON.stringify(tenantData))}; path=/; max-age=86400; SameSite=Lax`;

    setUser(fullUser);
    setTenant(tenantData);
  };

  const login = async (email: string, password: string): Promise<LoginResult | void> => {
    try {
      const res = await authService.login(email, password);

      if (res.requiresTenantSelection && res.tenants) {
        return { requiresTenantSelection: true, tenants: res.tenants };
      }

      if (res.access_token && res.tenant) {
        localStorage.setItem(AUTH_CONFIG.tokenKey, res.access_token);
        document.cookie = `${AUTH_CONFIG.tokenKey}=${res.access_token}; path=/; max-age=86400; SameSite=Lax`;

        const fullUser = await authService.getMe();
        storeSession(res.access_token, fullUser, res.tenant);
        toast.success('Login successful!');
        router.push(getRedirectTarget());
      }
    } catch (error) {
      localStorage.removeItem(AUTH_CONFIG.tokenKey);
      document.cookie = `${AUTH_CONFIG.tokenKey}=; path=/; max-age=0`;
      throw error;
    }
  };

  const googleLogin = async (idToken: string, tenantId?: string): Promise<LoginResult | void> => {
    try {
      const res = await authService.googleLogin(idToken, tenantId);

      if (res.requiresTenantSelection && res.tenants) {
        return { requiresTenantSelection: true, tenants: res.tenants };
      }

      if (res.access_token && res.tenant) {
        localStorage.setItem(AUTH_CONFIG.tokenKey, res.access_token);
        document.cookie = `${AUTH_CONFIG.tokenKey}=${res.access_token}; path=/; max-age=86400; SameSite=Lax`;

        const fullUser = await authService.getMe();
        storeSession(res.access_token, fullUser, res.tenant);
        toast.success('Google Login successful!');
        router.push(getRedirectTarget());
      }
    } catch (error) {
      localStorage.removeItem(AUTH_CONFIG.tokenKey);
      document.cookie = `${AUTH_CONFIG.tokenKey}=; path=/; max-age=0`;
      throw error;
    }
  };

  const selectTenant = async (email: string, password: string, tenantId: string) => {
    try {
      const res = await authService.selectTenant({ email, password, tenantId });

      if (res.access_token && res.tenant) {
        localStorage.setItem(AUTH_CONFIG.tokenKey, res.access_token);
        document.cookie = `${AUTH_CONFIG.tokenKey}=${res.access_token}; path=/; max-age=86400; SameSite=Lax`;

        const fullUser = await authService.getMe();
        storeSession(res.access_token, fullUser, res.tenant);
        toast.success('Tenant selected successfully!');
        router.push(getRedirectTarget());
      }
    } catch (error) {
      localStorage.removeItem(AUTH_CONFIG.tokenKey);
      document.cookie = `${AUTH_CONFIG.tokenKey}=; path=/; max-age=0`;
      throw error;
    }
  };

  const switchTenant = async (tenantId: string) => {
    try {
      const res = await authService.switchTenant(tenantId);

      if (res.access_token && res.tenant) {
        localStorage.setItem(AUTH_CONFIG.tokenKey, res.access_token);
        document.cookie = `${AUTH_CONFIG.tokenKey}=${res.access_token}; path=/; max-age=86400; SameSite=Lax`;

        const fullUser = await authService.getMe();
        storeSession(res.access_token, fullUser, res.tenant);
        toast.success(`Switched to tenant ${res.tenant.name}`);

        // Reload page to refresh all tenant queries and context cleanly
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to switch tenant.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
    localStorage.removeItem(AUTH_CONFIG.userKey);
    localStorage.removeItem(AUTH_CONFIG.tenantKey);

    document.cookie = `${AUTH_CONFIG.tokenKey}=; path=/; max-age=0`;
    document.cookie = `${AUTH_CONFIG.userKey}=; path=/; max-age=0`;
    document.cookie = `${AUTH_CONFIG.tenantKey}=; path=/; max-age=0`;

    setUser(null);
    setTenant(null);
    toast.info('You have been logged out.');
    router.push(FRONTEND_ROUTES.LOGIN);
  };

  // Keep profile, roles, and permissions in sync with the backend
  const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_CONFIG.tokenKey) : null;
  const { data: meUser, error: meError } = useMe({
    enabled: !!token && !!user,
  });

  useEffect(() => {
    if (meUser) {
      setUser(meUser);
      if (isSiteManagerUser(meUser)) {
        localStorage.setItem('active_environment', Environment.PROD);
        setEnvironment(Environment.PROD);
      }
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(meUser));
      document.cookie = `${AUTH_CONFIG.userKey}=${encodeURIComponent(JSON.stringify(meUser))}; path=/; max-age=86400; SameSite=Lax`;
    }
  }, [meUser, setEnvironment]);

  useEffect(() => {
    if (meError) {
      console.error('Error fetching latest user profile:', meError);
      if ((meError as any).response?.status === 401) {
        logout();
      }
    }
  }, [meError]);

  // ─── Derived RBAC state ─────────────────────────────────────────────────────

  const { roles, permissions, locationScope } = extractRbacFromUser(user);
  const superAdmin = roles.includes(AppRole.SUPER_ADMIN);
  const admin = superAdmin || roles.includes(AppRole.ADMIN);

  const hasPermission = useCallback(
    (code: AppPermission | string): boolean => {
      if (superAdmin) return true;
      if (admin && code !== AppPermission.TENANTS_READ) return true;
      return permissions.includes(code as AppPermission);
    },
    [superAdmin, admin, permissions],
  );

  const hasRole = useCallback(
    (role: string): boolean => roles.includes(role),
    [roles],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        loading,
        login,
        googleLogin,
        selectTenant,
        switchTenant,
        logout,
        isAuthenticated: !!user,
        roles,
        permissions,
        locationScope,
        hasPermission,
        hasRole,
        isSuperAdmin: superAdmin,
        isAdmin: admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
