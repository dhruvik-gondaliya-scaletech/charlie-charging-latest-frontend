'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ShieldCheck, Cpu, Layers, Coins, Calendar, HeartPulse, LucideIcon } from 'lucide-react';
import { featuresData } from '../data/evChargingData';

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Cpu,
  Layers,
  Coins,
  Calendar,
  HeartPulse,
};

export function FeaturesGridSection() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section id="features" className="py-24 bg-muted/30 border-y border-border/40 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Heading Content */}
          <div className="lg:col-span-4 flex flex-col space-y-4 lg:sticky lg:top-28">
            <span className="text-[11px] font-bold tracking-widest text-primary uppercase">
              ADVANCED ENGINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-[1.1]">
              Robust Features for Efficient EV Charging Management
            </h2>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
              ScaleEV provides the robust features needed to manage a growing charging network. Our tools help operators control pricing, balance load, and keep stations running smoothly.
            </p>
          </div>

          {/* Right Column: 2x3 Feature Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10"
          >
            {featuresData.map((feat) => {
              const Icon = iconMap[feat.iconName] || ShieldCheck;
              return (
                <motion.div
                  key={feat.title}
                  variants={itemVariants}
                  className="flex space-x-4 group cursor-pointer"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-background border border-border/60 text-primary flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
                    <Icon className="w-5 h-5" />
                  </div>
                  {/* Copy */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
                      {feat.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
