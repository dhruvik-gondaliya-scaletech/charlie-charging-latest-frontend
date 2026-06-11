'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { motion } from 'framer-motion';
import { BrandLogo } from '@/components/shared/BrandLogo';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Menu, X } from 'lucide-react';

export function HeaderSection() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Complexity', href: '#complexity' },
    { name: 'Command Center', href: '#solutions' },
    { name: 'Driver App', href: '#driver-app' },
    { name: 'Flow', href: '#flow' },
    { name: 'Intelligence', href: '#analytics' },
    { name: 'Proof', href: '#testimonials' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 sm:px-6 pointer-events-none"
    >
      <div
        className={`
          flex items-center justify-between w-full max-w-6xl h-16 px-6
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

        <Link href="/" prefetch={false} className="flex items-center group relative z-10">
          <BrandLogo
            width={110}
            height={30}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              prefetch={false}
              className="px-3.5 py-2 text-[12px] font-black tracking-widest uppercase text-muted-foreground hover:text-foreground transition-all relative group"
            >
              {item.name}
              <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          ))}
        </nav>

        {/* CTA & Drawer Trigger */}
        <div className="flex items-center gap-3 relative z-10">
          <Link href="#demo" prefetch={false} className="hidden sm:block">
            <Button
              variant="outline"
              className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 text-primary font-bold text-xs rounded-full h-9 px-5 backdrop-blur-sm transition-all"
            >
              Book Demo
            </Button>
          </Link>
          <Link href={FRONTEND_ROUTES.LOGIN} prefetch={false} className="hidden sm:block">
            <Button className="bg-primary text-primary-foreground font-black text-[11px] tracking-widest uppercase px-6 rounded-full h-9 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              Login
            </Button>
          </Link>

          {/* Mobile Drawer */}
          <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-muted">
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full w-[300px] bg-background/95 backdrop-blur-3xl border-l border-border p-0 rounded-none shadow-2xl">
              <div className="flex flex-col h-full">
                <div className="p-6 flex justify-between items-center border-b border-border/50">
                  <BrandLogo width={100} height={28} />
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Navigation</p>
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      prefetch={false}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-bold text-muted-foreground hover:text-primary transition-all tracking-tight"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="p-6 border-t border-border/50 flex flex-col gap-3">
                  <Link href="#demo" prefetch={false} className="w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-primary/30 text-primary">
                      Book Demo
                    </Button>
                  </Link>
                  <Link href={FRONTEND_ROUTES.LOGIN} prefetch={false} className="w-full">
                    <Button className="w-full h-12 rounded-xl font-black text-xs tracking-widest uppercase shadow-xl shadow-primary/20">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </motion.header>
  );
}
