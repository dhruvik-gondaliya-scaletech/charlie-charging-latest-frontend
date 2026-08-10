'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FRONTEND_ROUTES } from '@/constants/constants';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md text-center"
      >
        {/* Glassmorphic card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl shadow-black/40">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20"
            >
              <ShieldX className="h-10 w-10 text-red-400" />
            </motion.div>
          </div>

          {/* Status */}
          <div className="mb-2">
            <span className="text-xs font-mono font-semibold tracking-widest text-red-400 uppercase">
              403 Forbidden
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>

          {/* Description */}
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            You don&apos;t have permission to access this page. This area is restricted
            to users with specific roles. Please contact your administrator if you believe
            this is a mistake.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="ghost"
              className="border border-white/10 text-white/70 hover:text-white hover:bg-white/8"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Link href={FRONTEND_ROUTES.DASHBOARD}>
              <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
