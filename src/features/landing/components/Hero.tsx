'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Car } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { staggerContainer, staggerItem } from '@/lib/motion';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-8 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="z-10"
        >
          <motion.span
            variants={staggerItem}
            className="inline-block py-1 px-3 bg-muted text-[10px] font-bold tracking-widest rounded-full mb-6 uppercase text-foreground"
          >
            Next Gen Infrastructure
          </motion.span>

          <motion.h1
            variants={staggerItem}
            className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-6 text-foreground"
          >
            Charging infrastructure that <br />
            scales with you
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-lg lg:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed font-medium"
          >
            Enterprise-grade OCPP 1.6, OCPP 2.0.1 and OCPI 2.2.1 compliant management platform for global charging networks.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="#demo">
              <Button variant="outline" size="lg" className="px-8 py-4 h-auto rounded-xl border-border font-bold hover:border-foreground hover:bg-accent hover:scale-[1.02] transition-all">
                Book a Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-muted to-transparent rounded-[2rem] -rotate-3 transition-transform group-hover:rotate-0 duration-700"></div>
          <div className="relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] p-4 shadow-2xl overflow-hidden">
            <div className="relative aspect-[4/3] w-full rounded-[1.5rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDukuUyW5bKUbQ6p99A4rho16Xq--ItrrjPpodd2Ncvl-gJRK_nK96QfIRKh4nAf4cyCDXq_jYU6x9N4eX7dxwAL_SJ7ZBSs__6LRYansEpP8I-S__kHUi647s2ATRBt2MIRDSrNkSSfILRsR8-j6HB-9q4NhuRRtGGEbvV4jxWDmYIKEMW0GrDn_3vj0roC0BBqCP-GG6Eaim5VAK5tAmgG6tsRAcXUvvMacSZMYAite31YUkKy3zrUdUVgry2MkC3YSwA-9PijQAv"
                alt="Minimalist high-contrast dashboard"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Floating Data Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-10 -left-6 bg-card/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-border hidden md:block"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Car className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 text-foreground">Active Sessions</p>
                  <p className="text-xl font-bold text-foreground">1,284</p>
                </div>
              </div>
              <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-primary"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
