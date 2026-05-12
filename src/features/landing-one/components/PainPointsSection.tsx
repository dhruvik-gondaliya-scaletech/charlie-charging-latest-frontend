'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Split, 
  WifiOff, 
  Maximize2, 
  EyeOff, 
  UserX, 
  PieChart, 
  Unplug, 
  Clock 
} from 'lucide-react';

const painPoints = [
  {
    icon: Split,
    title: 'Fragmented Management',
    desc: 'Juggling multiple hardware vendors and proprietary protocols creates extreme operational friction.',
    accent: 'from-orange-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-orange-500/40',
    iconColor: 'text-orange-500',
  },
  {
    icon: WifiOff,
    title: 'Downtime Issues',
    desc: 'Silent charger failures and offline state anomalies lead to lost revenue and frustrated drivers.',
    accent: 'from-red-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-red-500/40',
    iconColor: 'text-red-500',
  },
  {
    icon: Maximize2,
    title: 'Difficult Scalability',
    desc: 'Legacy backends buckle under dense transaction streams as multi-location network expansion ramps up.',
    accent: 'from-blue-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-blue-500/40',
    iconColor: 'text-blue-500',
  },
  {
    icon: EyeOff,
    title: 'Poor Transaction Visibility',
    desc: 'Blind spots in real-time billing handshakes make dispute resolution and settlement reconciliation painful.',
    accent: 'from-purple-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-purple-500/40',
    iconColor: 'text-purple-500',
  },
  {
    icon: UserX,
    title: 'Weak Driver Experience',
    desc: 'Clunky roaming setups, buggy native web wrappers, and complex payment steps drive user churn.',
    accent: 'from-amber-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-amber-500/40',
    iconColor: 'text-amber-500',
  },
  {
    icon: PieChart,
    title: 'Limited Insights',
    desc: 'Lack of granular hardware telematics prevents predictive maintenance and peak load optimization.',
    accent: 'from-emerald-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-emerald-500/40',
    iconColor: 'text-emerald-500',
  },
  {
    icon: Unplug,
    title: 'Disconnected Systems',
    desc: 'Siloed data prevents automated synchronization between energy grids, fleet tools, and billing engines.',
    accent: 'from-cyan-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-cyan-500/40',
    iconColor: 'text-cyan-500',
  },
  {
    icon: Clock,
    title: 'Inefficient Operations',
    desc: 'Manual firmware staging and slow remote reset triggers inflate support tickets and dispatch overhead.',
    accent: 'from-primary/10 via-transparent to-transparent',
    borderHover: 'hover:border-primary/40',
    iconColor: 'text-primary',
  },
];

export function PainPointsSection() {
  return (
    <section id="complexity" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-muted/20 dark:bg-background">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft grid background */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(var(--primary-rgb, 150, 150, 150), 1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary-rgb, 150, 150, 150), 1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Dynamic backglow orbs */}
        <div className="absolute top-[20%] left-[5%] w-[450px] h-[450px] rounded-full bg-red-500/5 dark:bg-red-500/5 blur-[140px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-orange-500/5 dark:bg-orange-500/5 blur-[150px]" />

        {/* Ambient top & bottom depth overlays */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-3.5 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-black tracking-widest uppercase mb-4 border border-destructive/20">
            Industry Bottlenecks
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-5">
            The Hidden Complexity of{' '}
            <span className="text-destructive block sm:inline">EV Infrastructure</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Without centralized operating primitives, multi-tenant charging infrastructure becomes trapped in legacy fragmentation and operational debt.
          </p>
        </motion.div>

        {/* Pain Points Grid with Rich Floating Glass Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`
                relative rounded-2xl border border-border/80 dark:border-white/5 
                bg-background/60 dark:bg-card/40 backdrop-blur-xl p-6 overflow-hidden
                shadow-lg shadow-black/[0.02] dark:shadow-none
                transition-all duration-300 ${item.borderHover} group
              `}
            >
              {/* Internal layered ambient gradient backplate */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

              {/* Glowing Top Left Decor line */}
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-foreground/10 dark:via-white/10 to-transparent group-hover:via-primary/30 transition-colors" />

              {/* Card Header & Icon */}
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-10 h-10 rounded-xl bg-muted/60 dark:bg-background/50 border border-border/60 flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black tracking-widest text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors">
                  0{idx + 1}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="font-bold text-base text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Subtle Corner Anchor tag */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive block" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
