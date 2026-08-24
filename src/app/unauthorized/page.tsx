'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FRONTEND_ROUTES } from '@/constants/constants';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden transition-colors duration-300">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md text-center z-10"
      >
        <Card className="p-8 md:p-10 border border-border/50 bg-card/70 backdrop-blur-md dark:bg-white/5 dark:backdrop-blur-xl shadow-2xl flex flex-col items-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 dark:border-red-500/30"
            >
              <ShieldX className="h-10 w-10 text-red-600 dark:text-red-400" />
            </motion.div>
          </div>

          {/* Status */}
          <div className="mb-2">
            <span className="text-xs font-mono font-semibold tracking-widest text-red-600 dark:text-red-400 uppercase">
              403 Forbidden
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-foreground mb-3">Access Denied</h1>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-[340px]">
            You don&apos;t have permission to access this page. This area is restricted
            to users with specific roles. Please contact your administrator if you believe
            this is a mistake.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
            <Link href={FRONTEND_ROUTES.DASHBOARD} className="w-full sm:w-auto">
              <Button className="w-full cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

