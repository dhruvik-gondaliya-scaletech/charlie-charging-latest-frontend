'use client';

import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Sidebar } from '@/components/shared/Sidebar';
import { Header } from '@/components/shared/Header';
import { BottomNav } from '@/components/shared/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background">
        <aside className="hidden md:block w-64 shrink-0">
          <Sidebar />
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar pb-24 md:pb-6">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
    </ProtectedRoute>
  );
}
