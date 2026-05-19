'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { HeroSection } from '../components/HeroSection';
import { ProblemSection } from '../components/ProblemSection';
import { SolutionSection } from '../components/SolutionSection';
import { FinalCTASection } from '../components/FinalCTASection';

export function LandingThreeContainer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary font-sans antialiased overflow-x-hidden transition-colors duration-300">
      {/* 
        Minimalist locked header with zero external navigation links. 
        Only provides branding and anchors the user on the page. 
      */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto h-20 px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <BrandLogo width={130} height={40} />
          </div>
          <div className="flex items-center gap-4">
            {!mounted ? (
              <div className="w-8 h-8 rounded-lg bg-muted/20 animate-pulse" />
            ) : (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-primary" />
                ) : (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
            <button
              onClick={() => {
                document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative group inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-bold rounded-lg bg-gradient-to-br from-primary to-primary/80 focus:ring-2 focus:outline-none focus:ring-primary/50 transition-all cursor-pointer shadow-lg shadow-primary/20"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 text-foreground group-hover:text-primary-foreground">
                Book Demo
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main point-to-point progression flow */}
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FinalCTASection />
      </main>

      {/* Locked distraction-free footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-6 lg:px-8 text-center text-xs text-muted-foreground transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Scale EV (Charlie Charging). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Secure & OCPP 1.6J/2.0.1 Compliant Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
