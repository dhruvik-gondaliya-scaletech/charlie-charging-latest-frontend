'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { navItems } from '../data/evChargingData';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { FRONTEND_ROUTES } from '@/constants/constants';
import BookADemo from './BookADemo';

export function NavbarSection() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 sm:px-6 pointer-events-none"
      >
        <div
          className={`
            flex items-center justify-between w-full max-w-7xl h-16 px-6
            transition-all duration-700 pointer-events-auto relative
            ${scrolled
              ? 'bg-background/60 dark:bg-background/40 backdrop-blur-2xl border border-border/80 dark:border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] scale-[0.98]'
              : 'bg-transparent border-transparent scale-100'
            }
          `}
        >
          {/* Glow accent behind logo when scrolled */}
          {scrolled && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none -z-10" />
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center group relative z-10">
            <BrandLogo
              width={110}
              height={30}
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[13px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200 relative py-1 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4 relative z-10">
            <BookADemo>
              <Button variant="ghost" className="font-semibold text-[13px] tracking-wide hover:bg-primary/5 hover:text-primary transition-all">
                Book Demo
              </Button>
            </BookADemo>
            <Link href={FRONTEND_ROUTES.LOGIN}>
              <Button className="font-bold text-[13px] tracking-wide px-5 py-2.5 rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary text-primary-foreground">
                Partner Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground/80 hover:text-foreground hover:bg-muted/40 rounded-full transition-colors relative z-10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden bg-background/95 backdrop-blur-lg flex flex-col justify-between pt-24 pb-8 px-6"
          >
            <div className="flex flex-col space-y-6">
              <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">Navigation</span>
              <nav className="flex flex-col space-y-5">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-semibold tracking-tight text-foreground/90 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col space-y-3 pt-6 border-t border-border/40">
              <BookADemo onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-12 rounded-xl text-[14px] font-semibold border-border hover:bg-muted">
                  Book Demo
                </Button>
              </BookADemo>
              <Link href={FRONTEND_ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full h-12 rounded-xl text-[14px] font-bold shadow-lg shadow-primary/25 bg-primary text-primary-foreground flex items-center justify-center gap-2">
                  Partner Login <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
