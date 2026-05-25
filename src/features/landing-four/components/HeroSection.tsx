'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Play, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative min-h-screen pt-36 pb-20 flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image & Legibility Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/assets/ev_network_owner.png"
          alt="EV Network Owner Background"
          fill
          priority
          className="object-cover object-center opacity-65 dark:opacity-20"
        />
        {/* Semi-transparent background mask for solid text contrast */}
        <div className="absolute inset-0 bg-background/65 backdrop-blur-[3px]" />

        {/* Soft radial and linear gradients to blend background image seamlessly */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--background)_100%)]" />
      </div>

      {/* Ambient background glow blurs for depth */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none z-0" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center space-y-8 md:space-y-10 w-full"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-primary/15 border border-primary/35 rounded-full px-4 py-1.5 w-fit">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-[12px] font-bold text-primary tracking-wide uppercase">
              Next-Gen CSMS Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.08] max-w-3xl"
          >
            Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">EV Charging</span> Network. Globally.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-foreground/85 dark:text-foreground/75 max-w-2xl font-semibold leading-relaxed"
          >
            Hardware-agnostic OCPP management software built for global fleet operators, commercial properties, and public charging networks. Fully OCPP 2.0.1 compliant.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
            <Link href="#demo" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:scale-[1.03] active:scale-[0.98] transition-all rounded-full px-8 py-6 text-sm font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                Deploy Instantly <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#solutions" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-border hover:bg-muted/50 bg-background/40 backdrop-blur-sm rounded-full px-8 py-6 text-sm font-bold flex items-center justify-center gap-2">
                <Play className="w-3.5 h-3.5 fill-foreground text-foreground" /> Watch Demo
              </Button>
            </Link>
          </motion.div>

          {/* Value props */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-x-6 gap-y-4 pt-8 border-t border-border/20 w-full max-w-2xl"
          >
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-foreground/95 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 shadow-md">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> OCPP 1.6-J & 2.0.1 Ready
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-foreground/95 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 shadow-md">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Dynamic Load Balancing
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-foreground/95 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 shadow-md">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> White-Label Driver Apps
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
