'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { EnvironmentProvider } from '@/contexts/EnvironmentContext';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ─── Staleness ──────────────────────────────────────────────────────────
      // Data is considered fresh for 5 minutes. Identical GET queries fired
      // within this window return the cached response without hitting the network.
      staleTime: 1000 * 60 * 5, // 5 min

      // ─── Garbage collection ──────────────────────────────────────────────────
      // Inactive (unmounted) query data is kept in the in-memory cache for
      // 10 minutes before being removed. Navigating back to a page within that
      // window skips the network entirely while the data is still fresh.
      gcTime: 1000 * 60 * 10, // 10 min

      // ─── Retry / refetch behaviour ───────────────────────────────────────────
      retry: 1,
      refetchOnWindowFocus: false,   // don't re-fetch just because the tab was re-focused
      refetchOnReconnect: true,      // re-fetch stale queries when the network comes back
      refetchOnMount: true,          // re-fetch if data is stale when a component mounts
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <EnvironmentProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </EnvironmentProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
