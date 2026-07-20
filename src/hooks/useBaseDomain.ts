import { useState, useEffect } from 'react';

/**
 * Custom hook to dynamically fetch the base domain (host) of the current application.
 * Falls back to 'scaleev.scaletech.xyz' during server-side rendering or if not in a browser environment.
 */
export function useBaseDomain(defaultDomain: string = 'scaleev.scaletech.xyz'): string {
  const [baseDomain, setBaseDomain] = useState(defaultDomain);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseDomain(window.location.host);
    }
  }, []);

  return baseDomain;
}
