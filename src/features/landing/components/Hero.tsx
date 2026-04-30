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
    <section className="relative pt-40 pb-24 px-8 overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="z-10"
        >
          <motion.div
            variants={staggerItem}
            className="inline-flex items-center gap-2 py-1.5 px-4 bg-muted/50 backdrop-blur-xl border border-border/50 text-[10px] font-black tracking-[0.2em] rounded-full mb-8 uppercase text-foreground/70"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
            Next Gen EV Infrastructure
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.95] mb-8 text-foreground"
          >
            Infrastructure <br />
            <span className="text-primary">Without Weight.</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-xl lg:text-2xl text-muted-foreground max-w-xl mb-12 leading-relaxed font-medium"
          >
            Enterprise-grade OCPP management platform. Scale your charging network with spatial precision and buttery-smooth operations.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="#demo">
              <Button size="lg" className="px-10 py-7 h-auto rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all bg-primary text-primary-foreground group">
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-10 py-7 h-auto rounded-2xl border-border font-bold text-lg hover:border-foreground hover:bg-accent/50 backdrop-blur-xl transition-all">
                Explore Features
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 5, rotateY: -5 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative perspective-2000"
        >
          <div className="relative bg-card/20 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden group">
              <Image
                src="/assets/ev_dashboard.png"
                alt="Scale EV Dashboard"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Floating Data Cards - Spatial Depth */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute top-12 -right-8 bg-card/80 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-border/50 hidden xl:block z-20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black opacity-50">Uptime</p>
                  <p className="text-2xl font-bold">99.99<span className="text-sm opacity-50">%</span></p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-12 -left-8 bg-card/80 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-border/50 hidden xl:block z-20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black opacity-50">Sessions</p>
                  <p className="text-2xl font-bold">4.2<span className="text-sm opacity-50">k+</span></p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

