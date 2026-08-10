'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_CONFIG, FRONTEND_ROUTES } from '@/constants/constants';
import { User, Tenant } from '@/types';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  // RBAC fields
  roles: string[];
  permissions: string[];
  locationScope: string[];          // empty = unrestricted (ADMIN / SUPER_ADMIN)
  hasPermission: (code: string) => boolean;
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

const extractRbacFromUser = (user: User | null) => ({
  roles: user?.roles ?? [],
  permissions: user?.permissions ?? [],
  locationScope: user?.locations ?? [],
});

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { access_token, user, tenant } = await authService.login(email, password);

      localStorage.setItem(AUTH_CONFIG.tokenKey, access_token);
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(user));
      localStorage.setItem(AUTH_CONFIG.tenantKey, JSON.stringify(tenant));

      document.cookie = `${AUTH_CONFIG.tokenKey}=${access_token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `${AUTH_CONFIG.userKey}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `${AUTH_CONFIG.tenantKey}=${encodeURIComponent(JSON.stringify(tenant))}; path=/; max-age=86400; SameSite=Lax`;

      setUser(user);
      setTenant(tenant);
      toast.success('Login successful!');
      router.push(FRONTEND_ROUTES.DASHBOARD);
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (idToken: string) => {
    try {
      const { access_token, user, tenant } = await authService.googleLogin(idToken);

      localStorage.setItem(AUTH_CONFIG.tokenKey, access_token);
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(user));
      localStorage.setItem(AUTH_CONFIG.tenantKey, JSON.stringify(tenant));

      document.cookie = `${AUTH_CONFIG.tokenKey}=${access_token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `${AUTH_CONFIG.userKey}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `${AUTH_CONFIG.tenantKey}=${encodeURIComponent(JSON.stringify(tenant))}; path=/; max-age=86400; SameSite=Lax`;

      setUser(user);
      setTenant(tenant);
      toast.success('Google Login successful!');
      router.push(FRONTEND_ROUTES.DASHBOARD);
    } catch (error) {
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

  // ─── Derived RBAC state ─────────────────────────────────────────────────────

  const { roles, permissions, locationScope } = extractRbacFromUser(user);
  const superAdmin = roles.includes('SUPER_ADMIN');
  const admin = superAdmin || roles.includes('ADMIN');

  const hasPermission = useCallback(
    (code: string): boolean => {
      if (superAdmin) return true;
      return permissions.includes(code);
    },
    [superAdmin, permissions],
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
