'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function PartnershipSection() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative aspect-square max-w-lg mx-auto lg:mx-0 rounded-[2rem] overflow-hidden shadow-2xl border border-border/50"
        >
          <Image
            src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop"
            alt="Handshake Partnership"
            fill
            className="object-cover"
            unoptimized
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">EV Partners for Business</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">EV Charging Success With Industry Leading Partnerships</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            The Scale EV ecosystem is built on transparency, security, and world-class support. We partner with the biggest names in tech and energy to ensure your charging network remains future-proof.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10 opacity-60">
            {/* Simple logo placeholders to match reference style */}
            <div className="flex items-center justify-center h-10 font-bold text-base sm:text-lg tracking-tighter italic">stripe</div>
            <div className="flex items-center justify-center h-10 font-bold text-base sm:text-lg tracking-widest">SAP</div>
            <div className="flex items-center justify-center h-10 font-bold text-base sm:text-lg tracking-tighter">SIEMENS</div>
            <div className="flex items-center justify-center h-10 font-bold text-base sm:text-lg">ORACLE</div>
          </div>

          <Button className="px-8 py-6 h-auto rounded-xl font-bold text-base shadow-lg shadow-primary/20 bg-primary text-primary-foreground group">
            Partner with us
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
