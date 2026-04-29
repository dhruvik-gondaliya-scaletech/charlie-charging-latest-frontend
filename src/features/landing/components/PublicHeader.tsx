'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { motion } from 'framer-motion';
import { BrandLogo } from '@/components/shared/BrandLogo';

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Menu } from 'lucide-react';

export function PublicHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkColor = scrolled
    ? 'text-foreground/70 hover:text-foreground'
    : 'text-muted-foreground hover:text-foreground';

  const navItems = ['Features', 'Protocols', 'Analytics', 'Contact'];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 pt-4 px-4 h-24 pointer-events-none"
    >
      <div
        className={`
          flex items-center justify-between w-full max-w-7xl px-4 md:px-8 h-16
          transition-all duration-500 pointer-events-auto
          ${scrolled
            ? 'bg-background/80 backdrop-blur-2xl border border-border/50 rounded-full shadow-xl shadow-primary/10 py-4 scale-[0.98]'
            : 'bg-transparent border-transparent py-6 scale-100'
          }
        `}
      >
        <Link href="/" className="flex items-center group">
          <BrandLogo
            width={120}
            height={32}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`text-sm font-semibold ${navLinkColor} transition-all hover:-translate-y-0.5`}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href={FRONTEND_ROUTES.LOGIN} className="hidden sm:block">
            <Button variant="ghost" size="sm" className={`${navLinkColor} font-medium transition-all hover:bg-accent/10`}>
              Sign In
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className={`md:hidden ${navLinkColor}`}>
                <Menu className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full w-[300px] sm:w-[400px] bg-background border-l border-border/40 p-0 rounded-none">
              <div className="flex flex-col h-full bg-background">
                <div className="p-6 border-b border-border/40">
                  <DrawerTitle className="text-left">
                    <BrandLogo width={120} height={32} />
                  </DrawerTitle>
                </div>
                <div className="flex-1 p-6 flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-bold text-foreground hover:text-primary transition-colors py-2 border-b border-border/20 last:border-0"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
                <div className="p-6 mt-auto border-t border-border/40 flex flex-col gap-4">
                  <Link href={FRONTEND_ROUTES.LOGIN} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-border">
                      Sign In
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
