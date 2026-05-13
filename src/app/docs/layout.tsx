import React from 'react';
import { Metadata } from 'next';
import { DocsSidebar } from '@/features/docs/components/DocsSidebar';

export const metadata: Metadata = {
  title: 'Partner API Reference Portal | Scale EV',
  description: 'Enterprise-grade dynamic documentation portal for trusted third-party CSMS partners and tenant developers.',
};

export default function DocsRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-gray-950 text-gray-100 antialiased selection:bg-emerald-500 selection:text-black">
      <DocsSidebar />
      {children}
    </div>
  );
}
