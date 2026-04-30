'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background overflow-hidden transition-colors duration-500">
      {/* Branding Side - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden transition-all duration-700 bg-white dark:bg-zinc-950 border-r border-border dark:border-zinc-900">
        {/* Background Visual Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 transition-all duration-700 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-zinc-950 dark:via-zinc-950/40 dark:to-transparent" />
        </div>

        <div className="relative z-10 p-16 flex flex-col justify-between w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/" className="flex items-center group">
              <BrandLogo width={180} height={48} />
            </Link>
          </motion.div>

          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl font-bold tracking-tighter mb-6 leading-[1.1] transition-colors duration-500 text-zinc-900 dark:text-white"
            >
              The intelligence layer for <br />modern energy networks.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl font-medium leading-relaxed transition-colors duration-500 text-zinc-600 dark:text-zinc-400"
            >
              Empowering network operators with real-time telemetry, automated settlement, and future-proofed OCPP infrastructure.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest transition-colors duration-500 text-zinc-400 dark:text-zinc-500"
          >
            <div className="h-px w-12 transition-colors duration-500 bg-zinc-200 dark:bg-zinc-800" />
            Built for scale
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-background min-h-screen lg:min-h-0 transition-colors duration-500">
        <div className="absolute top-8 left-8 lg:left-24 z-20">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Button>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center p-8 lg:p-24">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md mx-auto"
          >
            {children}
          </motion.div>
        </div>

        {/* Mobile footer branding */}
        <div className="lg:hidden py-8 flex justify-center border-t border-border/50">
          <BrandLogo width={120} height={32} />
        </div>
      </div>
    </div>
  );
}
