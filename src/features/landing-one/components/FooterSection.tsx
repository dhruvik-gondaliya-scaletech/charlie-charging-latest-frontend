'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ArrowUpRight } from 'lucide-react';

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'OCPP Platform Broker', href: '#solutions' },
      { label: 'White-Label Driver App', href: '#driver-app' },
      { label: 'Executive Analytics', href: '#analytics' },
      { label: 'Smart Load Balancing', href: '#workflow' },
      { label: 'Hardware Roaming Matrix', href: '#solutions' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'OCPP 1.6J / 2.0.1 Docs', href: '#' },
      { label: 'Sandbox TLS Stubs', href: '#' },
      { label: 'CDR Routing schemas', href: '#' },
      { label: 'Integration Guides', href: '#' },
      { label: 'Status & API Uptime', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Scale EV', href: '#' },
      { label: 'Investor Relations', href: '#' },
      { label: 'Infrastructure Careers', href: '#' },
      { label: 'Press & Media kit', href: '#' },
      { label: 'Contact Brokers', href: '#contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Protocol', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Enterprise SLA Matrix', href: '#' },
      { label: 'Security Compliance', href: '#' },
      { label: 'Cookie Preferences', href: '#' },
    ],
  },
];

export function FooterSection() {
  return (
    <footer className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background border-t border-border/80 dark:border-white/5">
      
      {/* Subtle grid background mesh */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(var(--primary-rgb, 100, 100, 100), 1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary-rgb, 100, 100, 100), 1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main top footer multi-column grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-16 border-b border-border/40">
          
          {/* Brand Identity / Status Intro Column */}
          <div className="col-span-2 space-y-6 pr-4 lg:pr-8">
            <Link href="/" className="flex items-center gap-2.5 group inline-block">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-cyan-500 flex items-center justify-center text-primary-foreground font-black shadow-md shadow-primary/20 group-hover:rotate-6 transition-transform">
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <span className="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                SCALE <span className="text-primary font-normal">EV</span>
              </span>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Next-generation EV charging management platform. Engineered for scale, speed, and strict OCPP compliance across disparate public and fleet charging infrastructures.
            </p>

            {/* Live Operational Status Indicator Component */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-muted/60 border border-border/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-extrabold tracking-wide text-foreground">
                All systems operational
              </span>
              <span className="text-[10px] text-muted-foreground font-mono ml-1">
                99.95%
              </span>
            </div>
          </div>

          {/* Links Columns */}
          {footerColumns.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h5 className="text-xs font-black tracking-widest uppercase text-foreground">
                {col.title}
              </h5>
              <ul className="space-y-2.5">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="font-medium text-center sm:text-left">
            &copy; {new Date().getFullYear()} Scale EV Platform, Inc. All rights reserved. Built on verified protocol broker parameters.
          </p>

          <div className="flex items-center gap-4 text-[11px] font-bold">
            <span className="hover:text-foreground cursor-pointer transition-colors">OCPP Compliance</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">ISO 27001 Certified</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Global Roaming</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
