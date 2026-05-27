'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background glow radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl bg-gray-900 text-white overflow-hidden px-8 py-16 md:px-16 md:py-20 shadow-2xl border border-gray-800"
        >
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
            
            {/* Promo badge */}
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                Ready to Deploy
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Ready to Build Your EV Charging Network?
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed">
              Join companies worldwide that trust ScaleEV to power their charging infrastructure. Get started with your 14-day free trial or talk to our experts.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-4">
              <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700 transition-all">
                Book a Demo
              </button>
            </div>

            {/* Value indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <div>✓ 14-Day Free Trial</div>
              <div>✓ No Credit Card Required</div>
              <div>✓ OCPP 1.6J/2.0.1 Compliant</div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
