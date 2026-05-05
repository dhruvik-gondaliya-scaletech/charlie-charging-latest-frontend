'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Zap, Activity } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { staggerContainer, staggerItem } from '@/lib/motion';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col"
        >
          <motion.div
            variants={staggerItem}
            className="inline-flex items-center gap-2 py-1 px-3 bg-primary/10 border border-primary/20 text-[11px] font-bold tracking-widest rounded-full mb-6 uppercase text-primary w-fit"
          >
            The New Standard in EV Software
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6 text-foreground"
          >
            The White-Label <span className="text-primary">EV Charging</span> Management Platform
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-lg lg:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
          >
            Manage and scale your business with Scale EV&apos;s cloud-based charging software. Built for network operators who demand precision and reliability.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="#demo">
              <Button size="lg" className="px-8 py-6 h-auto rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all bg-primary text-primary-foreground group">
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8 py-6 h-auto rounded-xl border-border font-bold text-base hover:bg-accent/50 transition-all">
                Contact Sales
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:h-[500px] flex items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[600px] aspect-[4/3] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden shadow-2xl border border-border/50">
            <Image
              src="/assets/ev_hero_dashboard.png"
              alt="Scale EV Dashboard Preview"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/10 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Floating element for depth */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border border-border/50 hidden md:flex items-center gap-3 z-20"
          >
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold opacity-50">Live Status</p>
              <p className="text-sm font-bold text-foreground">98.4% Network Health</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
    </section>
  );
}

