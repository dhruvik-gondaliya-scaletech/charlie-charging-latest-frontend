'use client';

import React from 'react';
import { Twitter, Linkedin, Github, Mail, ShieldAlert } from 'lucide-react';

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Solutions', href: '#solutions' },
      { name: 'Features', href: '#features' },
      { name: 'Workflow', href: '#workflow' },
      { name: 'APIs & Webhooks', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Customers', href: '#' },
      { name: 'Contact Sales', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'System Status', href: '#' },
      { name: 'OCPP Spec Guide', href: '#' },
      { name: 'ISO 15118 PDF', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'GDPR Compliance', href: '#' },
      { name: 'Security Center', href: '#' },
    ],
  };

  return (
    <footer className="bg-background border-t border-border/40 py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-border/40">
          
          {/* Logo & Tagline Column */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black tracking-widest text-foreground uppercase">
                SCALE<span className="text-primary">EV</span>
              </span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed font-medium max-w-sm">
              The enterprise-grade OCPP backend and dynamic load management software that powers global electric vehicle charging networks.
            </p>
            {/* Social row */}
            <div className="flex items-center space-x-3 pt-2 text-muted-foreground">
              <a href="#" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:text-primary hover:border-primary/25 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:text-primary hover:border-primary/25 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:text-primary hover:border-primary/25 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:text-primary hover:border-primary/25 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            
            {/* Product */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
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
