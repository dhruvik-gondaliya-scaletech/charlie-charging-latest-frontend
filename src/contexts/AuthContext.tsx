'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_CONFIG } from '@/constants/constants';
import { User, Tenant } from '@/types';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  tenant: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

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

      // Set localStorage for client-side access
      localStorage.setItem(AUTH_CONFIG.tokenKey, access_token);
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(user));
      localStorage.setItem(AUTH_CONFIG.tenantKey, JSON.stringify(tenant));

      // Set cookies for middleware access
      document.cookie = `${AUTH_CONFIG.tokenKey}=${access_token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `${AUTH_CONFIG.userKey}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `${AUTH_CONFIG.tenantKey}=${encodeURIComponent(JSON.stringify(tenant))}; path=/; max-age=86400; SameSite=Lax`;

      setUser(user);
      setTenant(tenant);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
    localStorage.removeItem(AUTH_CONFIG.userKey);
    localStorage.removeItem(AUTH_CONFIG.tenantKey);
    
    // Clear cookies
    document.cookie = `${AUTH_CONFIG.tokenKey}=; path=/; max-age=0`;
    document.cookie = `${AUTH_CONFIG.userKey}=; path=/; max-age=0`;
    document.cookie = `${AUTH_CONFIG.tenantKey}=; path=/; max-age=0`;
    
    setUser(null);
    setTenant(null);
    toast.info('You have been logged out.');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
