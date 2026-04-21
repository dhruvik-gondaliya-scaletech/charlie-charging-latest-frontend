'use client';

import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { motion } from 'framer-motion';

export function PublicHeader() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColor = scrolled ? 'text-background' : 'text-foreground';
  const navLinkColor = scrolled ? 'text-background/80 hover:text-background' : 'text-muted-foreground hover:text-foreground';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 pt-4 px-4 h-24 pointer-events-none"
    >
      <div
        className={`
          flex items-center justify-between w-full max-w-7xl px-8 h-16
          transition-all duration-500 pointer-events-auto
          ${scrolled
            ? 'bg-foreground/80 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-xl shadow-primary/10 py-4 scale-[0.98]'
            : 'bg-transparent border-transparent py-6 scale-100'
          }
        `}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <Zap className={`h-6 w-6 ${textColor} fill-current group-hover:scale-110 transition-transform`} />
          <span className={`font-bold text-xl tracking-tighter ${textColor}`}>Scale EV</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'Protocols', 'Analytics', 'Contact'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`text-sm font-semibold ${navLinkColor} transition-all hover:-translate-y-0.5`}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href={FRONTEND_ROUTES.LOGIN}>
            <Button variant="ghost" size="sm" className={`${navLinkColor} font-medium transition-all hover:bg-accent/10`}>
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
