'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Environment = 'dev' | 'prod';

interface EnvironmentContextType {
  environment: Environment;
  setEnvironment: (env: Environment) => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const EnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [environment, setEnvironmentState] = useState<Environment>('dev');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Safely access localStorage on the client side
    const savedEnv = localStorage.getItem('active_environment') as Environment;
    if (savedEnv === 'dev' || savedEnv === 'prod') {
      setEnvironmentState(savedEnv);
    }
    setIsInitialized(true);
  }, []);

  const setEnvironment = (env: Environment) => {
    setEnvironmentState(env);
    localStorage.setItem('active_environment', env);
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
