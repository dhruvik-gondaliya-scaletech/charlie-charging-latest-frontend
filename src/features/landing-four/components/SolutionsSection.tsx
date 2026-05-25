'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Zap, CreditCard, Activity, Smartphone, Truck, Globe, Check } from 'lucide-react';
import { solutionsData } from '../data/evChargingData';

const iconMap: Record<string, React.ComponentType<any>> = {
  Zap,
  CreditCard,
  Activity,
  Smartphone,
  Truck,
  Globe,
};

export function SolutionsSection() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="solutions" className="py-24 bg-background relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header content */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col space-y-4">
          <span className="text-[11px] font-bold tracking-widest text-primary uppercase">
            POWERFUL PLATFORM
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            All-in-One EV Charging Management Software
          </h2>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            ScaleEV delivers a comprehensive, enterprise-ready platform designed to simplify charging network operations. From real-time monitoring to automated billing and driver management, our suite of tools ensures your infrastructure is always optimized and generating revenue.
          </p>
        </div>

        {/* 6-Card Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {solutionsData.map((solution) => {
            const Icon = iconMap[solution.iconName] || Zap;
            return (
              <motion.div
                key={solution.id}
                variants={cardVariants}
                className="group relative rounded-3xl border border-border/60 bg-card p-8 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Highlight/glow hover filter */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div>
                  {/* Top card metadata */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-6 h-6" />
                    </div>
                    {solution.badge && (
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {solution.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 transition-colors group-hover:text-primary">
                    {solution.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-xs font-medium leading-relaxed mb-6">
                    {solution.description}
                  </p>
                </div>

                {/* Bullet Features */}
                <ul className="space-y-2 border-t border-border/40 pt-5">
                  {solution.features.map((feat) => (
                    <li key={feat} className="flex items-center space-x-2 text-[11px] font-semibold text-foreground/80">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
