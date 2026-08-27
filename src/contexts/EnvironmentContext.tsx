'use client';

import { Environment, AUTH_CONFIG } from '@/constants/constants';
import React, { createContext, useContext, useState, useEffect } from 'react';

export const isSiteManagerUser = (user: { roles?: string[]; role?: string } | null | undefined): boolean => {
  if (!user) return false;
  const userRoles = user.roles ?? (user.role ? [user.role] : []);
  return userRoles.some((r) => {
    if (!r) return false;
    const normalized = r.toString().toUpperCase().replace(/[\s_]+/g, '');
    return (
      normalized === 'SITEMANAGER' ||
      normalized === 'SITE_MANAGER' ||
      normalized === 'OPERATOR'
    );
  });
};

interface EnvironmentContextType {
  environment: Environment;
  setEnvironment: (env: Environment) => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const EnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [environment, setEnvironmentState] = useState<Environment>(Environment.DEV);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Safely access localStorage & URL search params on the client side
    let activeEnv: Environment | null = null;

    if (typeof window !== 'undefined') {
      try {
        const storedUserStr = localStorage.getItem(AUTH_CONFIG.userKey);
        if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          if (isSiteManagerUser(storedUser)) {
            activeEnv = Environment.PROD;
          }
        }
      } catch (e) {
        console.error('Error parsing stored user in EnvironmentContext:', e);
      }

      if (!activeEnv) {
        const searchParams = new URLSearchParams(window.location.search);
        const envParam = searchParams.get('env') || searchParams.get('environment');
        if (envParam) {
          const lower = envParam.toLowerCase();
          if (lower === 'dev' || lower === Environment.DEV) {
            activeEnv = Environment.DEV;
          } else if (lower === 'prod' || lower === Environment.PROD) {
            activeEnv = Environment.PROD;
          }
        }
      }

      if (!activeEnv) {
        const savedEnv = localStorage.getItem('active_environment') as Environment;
        if (savedEnv === Environment.DEV || savedEnv === Environment.PROD) {
          activeEnv = savedEnv;
        }
      }
    }

    if (activeEnv) {
      setEnvironmentState(activeEnv);
      localStorage.setItem('active_environment', activeEnv);
    }
    setIsInitialized(true);
  }, []);

  const setEnvironment = (env: Environment) => {
    let targetEnv = env;
    if (typeof window !== 'undefined') {
      try {
        const storedUserStr = localStorage.getItem(AUTH_CONFIG.userKey);
        if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          if (isSiteManagerUser(storedUser)) {
            targetEnv = Environment.PROD;
          }
        }
      } catch (e) {
        console.error('Error checking user role in setEnvironment:', e);
      }
    }
    setEnvironmentState(targetEnv);
    localStorage.setItem('active_environment', targetEnv);
  };

  // Prevent flash of incorrect default environment before initialization
  if (!isInitialized) {
    return null;
  }

  return (
    <EnvironmentContext.Provider value={{ environment, setEnvironment }}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};
