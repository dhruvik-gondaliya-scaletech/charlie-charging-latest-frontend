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

export function PublicHeader() {
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
    { name: 'Features', href: '#features' },
    { name: 'App', href: '#app' },
    // { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6 pointer-events-none"
    >
      <div
        className={`
          flex items-center justify-between w-full max-w-5xl h-16 px-6
          transition-all duration-700 pointer-events-auto relative
          ${scrolled
            ? 'bg-background/40 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-95'
            : 'bg-transparent border-transparent scale-100'
          }
        `}
      >
        <Link href="/" className="flex items-center group relative z-10">
          <BrandLogo
            width={100}
            height={28}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-[13px] font-black tracking-widest uppercase text-foreground/60 hover:text-foreground transition-all relative group"
            >
              {item.name}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 relative z-10">
          <Link href={FRONTEND_ROUTES.LOGIN} className="hidden sm:block">
            <Button className="bg-primary text-primary-foreground font-black text-[11px] tracking-widest uppercase px-6 rounded-full h-10 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              Login
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-white/5">
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full w-[300px] bg-background/95 backdrop-blur-3xl border-l border-white/10 p-0 rounded-none shadow-2xl">
              <div className="flex flex-col h-full">
                <div className="p-8 flex justify-between items-center border-b border-white/5">
                  <BrandLogo width={100} height={28} />
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 p-8 flex flex-col gap-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-4xl font-black text-foreground/40 hover:text-primary transition-all tracking-tighter"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="p-8 mt-auto border-t border-white/5 flex flex-col gap-4">
                  <Link href={FRONTEND_ROUTES.LOGIN} className="w-full">
                    <Button className="w-full h-14 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-primary/20">
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
