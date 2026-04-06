'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { motion } from 'framer-motion';

export function PublicHeader() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center bg-white/80 backdrop-blur-xl border-b border-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-8 w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Zap className="h-6 w-6 text-black fill-black" />
          <span className="font-bold text-xl tracking-tighter text-black">Scale EV</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'Protocols', 'Analytics', 'Pricing'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-semibold text-neutral-500 hover:text-black transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href={FRONTEND_ROUTES.LOGIN}>
            <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-black hover:bg-neutral-50 font-medium transition-all">
              Sign In
            </Button>
          </Link>
          <Link href={FRONTEND_ROUTES.REGISTER}>
            <Button size="sm" className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-neutral-900 hover:scale-105 transition-all shadow-sm hover:shadow-md">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
