'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { BrandLogo } from '@/components/shared/BrandLogo';
import Link from 'next/link';

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/40 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border/40">
          <div className="flex flex-col space-y-2">
            <Link href="/" prefetch={false} className="flex items-center group">
              <BrandLogo
                width={110}
                height={30}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-md pt-2">
              The enterprise-grade OCPP backend and dynamic load management software that powers global electric vehicle charging networks.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          <div>
            &copy; {currentYear} ScaleEV. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
              <span>SOC2 Type II Certified</span>
            </span>
            <span>•</span>
            <span>GDPR Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
