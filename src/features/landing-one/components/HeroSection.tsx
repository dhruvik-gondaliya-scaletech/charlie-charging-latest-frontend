'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, Zap, Shield, Globe, Cpu, Layers } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background pt-24 pb-16 selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle base grid */}
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(var(--primary-rgb, 120, 120, 120), 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary-rgb, 120, 120, 120), 0.8) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Cinematic ambient lighting and glow orbs */}
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/10 dark:bg-primary/15 blur-[160px] animate-pulse duration-10000" />
        <div className="absolute bottom-[5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-500/10 blur-[140px]" />
        <div className="absolute top-[40%] right-[25%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-[120px]" />

        {/* Simulated Smart City Animated Energy Routes */}
        <svg className="absolute inset-0 w-full h-full opacity-40 dark:opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cyanGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Flowing route lines */}
          <path
            d="M-100,150 Q300,200 500,100 T1200,300"
            fill="none"
            stroke="url(#energyGrad)"
            strokeWidth="1.5"
            strokeDasharray="8 8"
            className="animate-[dash_30s_linear_infinite]"
          />
          <path
            d="M1200,600 Q800,400 400,550 T-100,400"
            fill="none"
            stroke="url(#cyanGrad)"
            strokeWidth="1.5"
            strokeDasharray="12 12"
            className="animate-[dash_25s_linear_infinite]"
          />
        </svg>

        {/* Gradient overlays for content depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Premium Typography & CTA */}
          <div className="lg:col-span-7 text-left">
            
            {/* Status Micro-Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 text-primary text-[11px] font-black tracking-[0.2em] uppercase mb-6 backdrop-blur-md shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-primary relative z-10" />
              Intelligent OCPP Management Layer
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] mb-6"
            >
              Own Your EV{' '}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-cyan-500 bg-clip-text text-transparent block sm:inline">
                Charging Operations
              </span>{' '}
              Infrastructure
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-normal"
            >
              Scale EV gives operators complete control over charging infrastructure with intelligent OCPP-powered management. Built to scale weightlessly across smart cities and private fleets.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12"
            >
              <Link href="#demo" className="flex-1 sm:flex-initial">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 h-auto rounded-xl font-bold text-base shadow-xl shadow-primary/20 dark:shadow-primary/30 hover:scale-[1.02] hover:shadow-primary/40 transition-all duration-300 bg-primary text-primary-foreground group"
                >
                  Book Demo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#solutions" className="flex-1 sm:flex-initial">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 h-auto rounded-xl border-border/80 dark:border-white/10 font-bold text-base hover:bg-muted/50 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm"
                >
                  Explore Platform
                </Button>
              </Link>
            </motion.div>

            {/* Dynamic Real-time Uptime Stats Tag */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/60 dark:border-white/5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-foreground">99.95% SLA</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Uptime Guaranteed</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-foreground">14,200+ Nodes</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Global Endpoints</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: High-End Immersive Glassmorphic Visuals */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            
            {/* Centerpiece Container with Multi-layered Floating Glass Panels */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md mx-auto lg:max-w-none"
            >
              {/* Soft backplate shadow/glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-blue-500/5 to-purple-500/10 rounded-3xl blur-2xl transform -rotate-1 scale-105 -z-10" />

              {/* Main Floating Glass Panel Mockup */}
              <div className="relative rounded-2xl border border-border/80 dark:border-white/10 bg-background/80 dark:bg-card/40 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-5 sm:p-6 overflow-hidden">
                
                {/* Panel Top Actions/Status */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[10px] font-bold text-muted-foreground ml-2 tracking-widest uppercase">OCPP Engine v2.0.1</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Connected
                  </div>
                </div>

                {/* Sub-Card: Live Metrics Stream */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 dark:bg-background/40 border border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Active Output</p>
                        <p className="text-[10px] text-muted-foreground">Station Grid Alpha</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-primary">348.2 kW</p>
                      <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">+12.4% peak</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 dark:bg-background/40 border border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Cpu className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Transaction Load</p>
                        <p className="text-[10px] text-muted-foreground">Secure Handshake</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-foreground">1,420/sec</p>
                      <p className="text-[9px] text-muted-foreground font-bold">Latency 12ms</p>
                    </div>
                  </div>
                </div>

                {/* Algorithmic Pulse Graph representation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Grid Power Distribution</span>
                    <span className="text-[10px] font-bold text-primary">Optimized</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-16 pt-2">
                    {[40, 55, 65, 45, 80, 95, 85, 70, 90, 100, 85, 75, 88, 60, 70].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.04, ease: 'easeOut' }}
                        className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 to-primary hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Floating Glass Sub-Panel 1: Global map snippet overlay */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-4 sm:-left-8 rounded-xl border border-border/80 dark:border-white/10 bg-background/90 dark:bg-card/80 backdrop-blur-xl p-3 shadow-xl flex items-center gap-3 z-20"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Protocol Sync</p>
                  <p className="text-xs font-black text-foreground">OCPP 2.0 Ready</p>
                </div>
              </motion.div>

              {/* Floating Glass Sub-Panel 2: Security & Status overlay */}
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -right-4 sm:-right-8 rounded-xl border border-border/80 dark:border-white/10 bg-background/90 dark:bg-card/80 backdrop-blur-xl p-3 shadow-xl flex items-center gap-3 z-20"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Driver Experience</p>
                  <p className="text-xs font-black text-foreground">White-Label Native</p>
                </div>
              </motion.div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
