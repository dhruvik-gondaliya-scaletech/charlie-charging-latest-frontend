'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer } from '@/lib/motion';

export function HeroSection() {
  const handleScrollToCta = () => {
    document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-24 px-6 lg:px-8 bg-background text-foreground overflow-hidden transition-colors duration-300">
      {/* 
        Futuristic radial glows to simulate premium energy vibes.
      */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 dark:bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 dark:bg-primary/10 rounded-full blur-[180px] pointer-events-none" />
      
      {/* Background grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left Column: Direct Copywriting progression */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="lg:col-span-6 flex flex-col items-start text-left"
        >
          {/* Trust badge */}
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 dark:bg-white/5 border border-border dark:border-white/10 text-xs font-medium text-primary mb-6 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>White-Label CSMS Launching Globally</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-foreground leading-[1.1] mb-6"
          >
            Your Brand. <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your EV Charging Network.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
          >
            Launch your own fully-branded EV charging platform in days, not months. Secure, scalable, hardware-agnostic, and fully OCPP 1.6J/2.0.1 compliant.
          </motion.p>

          {/* Action Row */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <Button
              onClick={handleScrollToCta}
              className="relative py-6 px-8 rounded-xl font-bold text-base bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group border-0 cursor-pointer"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 text-primary-foreground group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Key Quick Specs */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-border w-full max-w-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-foreground">OCPP 1.6/2.0.1</p>
                <p className="text-muted-foreground">Universal Protocol Support</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-foreground">99.9% Uptime</p>
                <p className="text-muted-foreground">Enterprise Reliability</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Premium Double Mockup Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-6 relative flex items-center justify-center w-full min-h-[400px] lg:min-h-[500px]"
        >
          {/* Main Dashboard Mockup */}
          <div className="w-[85%] aspect-[16/10] bg-card/60 dark:bg-muted/40 rounded-[1.5rem] border border-border dark:border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-border/80 dark:hover:border-white/20">
            {/* Window bar */}
            <div className="h-8 border-b border-border bg-muted/40 flex items-center px-4 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-warning/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-success/40" />
              <div className="mx-auto text-[10px] text-muted-foreground font-mono">dashboard.scale-ev.com</div>
            </div>
            
            {/* Visual content inside dashboard */}
            <div className="p-4 h-full relative">
              <Image 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                alt="Scale EV Administration Dashboard"
                fill
                className="object-cover opacity-60 saturate-[0.8] hover:scale-105 transition-transform duration-1000"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
              
              {/* Overlay Glassmorphic Widget inside dashboard */}
              <div className="absolute bottom-12 left-4 p-3 rounded-lg bg-card/95 dark:bg-background/80 backdrop-blur-md border border-primary/20 text-xs w-[140px] text-foreground shadow-xl pointer-events-none">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Network Revenue</p>
                <p className="text-lg font-extrabold text-primary mt-1">$48,291.50</p>
                <div className="flex items-center gap-1 text-[9px] text-primary mt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  +12.4% this week
                </div>
              </div>
            </div>
          </div>

          {/* Overlapping White-label Mobile Phone Mockup */}
          <div className="absolute right-0 bottom-[-10px] sm:bottom-0 w-[42%] aspect-[9/18] bg-card rounded-[2.2rem] p-2.5 border-4 border-muted dark:border-muted shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-500">
            {/* Phone screen boundary */}
            <div className="relative w-full h-full rounded-[1.8rem] bg-background border border-border overflow-hidden flex flex-col justify-between">
              
              {/* Phone background image representing driver interface */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src="https://images.unsplash.com/photo-1558441719-ff34b0524a24?q=80&w=800&auto=format&fit=crop"
                  alt="Driver Application Interface"
                  fill
                  className="object-cover opacity-30 saturate-[0.7]"
                  sizes="(max-width: 600px) 100vw, 30vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>

              {/* Status Bar */}
              <div className="relative z-10 px-4 pt-3 flex justify-between text-[8px] text-muted-foreground font-mono">
                <span>9:41</span>
                <div className="w-12 h-3.5 rounded-full bg-muted border border-border mx-auto" />
                <span>100%</span>
              </div>

              {/* Mock Mobile UI elements */}
              <div className="relative z-10 p-3 flex flex-col gap-2 mt-auto">
                <div className="p-2.5 rounded-xl bg-card/90 border border-primary/20 backdrop-blur-md text-foreground">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-bold text-foreground uppercase tracking-wider">Charging Status</span>
                    <span className="text-[9px] text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-full">FAST CHARGE</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-foreground">82</span>
                    <span className="text-[10px] text-muted-foreground">%</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground mt-1">22 min remaining • 150 kW rate</p>
                </div>

                {/* Simulated Swipe button */}
                <div className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-black text-[9px] text-center uppercase tracking-widest shadow-lg shadow-primary/20 cursor-pointer">
                  Swipe to Stop
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
