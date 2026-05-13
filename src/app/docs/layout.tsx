import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner API Reference Portal | Scale EV',
  description: 'Enterprise-grade dynamic documentation portal for trusted third-party CSMS partners and tenant developers.',
};

export default function DocsRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-emerald-500 selection:text-black">
      {children}
    </div>
  );
}
