'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Code2, AlertTriangle } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/motion';

const painPoints = [
  {
    icon: Smartphone,
    title: 'Fragmented User Experiences',
    desc: 'Drivers get lost downloading multiple apps, hitting poor payment gates, and dealing with inconsistent branding that dilutes your company trust.',
  },
  {
    icon: Code2,
    title: 'Prohibitive Development Costs',
    desc: 'Building and maintaining custom CSMS backends and mobile apps takes millions of dollars and months of engineering, distracting from core operations.',
  },
  {
    icon: AlertTriangle,
    title: 'Complex Protocol Compliance',
    desc: 'Ensuring strict compliance with OCPP 1.6J, 2.0.1, and localized grid rules is a continuous security and maintenance headache.',
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-24 px-6 lg:px-8 bg-muted/30 text-foreground overflow-hidden transition-colors duration-300">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] bg-destructive/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-widest font-black text-destructive mb-3">
            The Status Quo
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground sm:text-center mb-6">
            The Fragmented EV Charging Struggle
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Charging network operators shouldn't have to build custom infrastructure just to scale. Standard integrations are broken and custom builds are complex.
          </p>
        </div>

        {/* 3-Column Pain Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {painPoints.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="relative group rounded-2xl bg-card border border-border hover:border-border/80 p-8 backdrop-blur-md transition-all duration-300 hover:translate-y-[-4px] shadow-sm hover:shadow-md"
            >
              {/* Top gradient border highlight */}
              <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-border/50 to-transparent group-hover:via-destructive/30 transition-all" />

              {/* Icon Container with glowing background */}
              <div className="mb-6 relative w-12 h-12 rounded-xl bg-muted dark:bg-muted/80 flex items-center justify-center border border-border dark:border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive to-destructive/80 opacity-10 group-hover:opacity-20 transition-opacity" />
                <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
              </div>

              {/* Text contents */}
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-destructive transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
