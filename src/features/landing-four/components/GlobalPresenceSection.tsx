'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Zap, CreditCard, Smartphone, Activity, ShieldCheck, Globe } from 'lucide-react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
}

function AnimatedCounter({ value, decimals = 0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 90,
  });
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toFixed(decimals);
      }
    });
  }, [springValue, decimals]);

  return <span ref={ref}>0</span>;
}

export function GlobalPresenceSection() {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Zap,
    CreditCard,
    Smartphone,
    Activity,
    ShieldCheck,
    Globe,
  };

  const stats = [
    { value: 99.99, suffix: '%', label: 'Uptime SLA', iconName: 'ShieldCheck', decimals: 2 },
    { value: 25, suffix: 'M+', label: 'Monthly Charging Sessions', iconName: 'Activity' },
    { value: 150, suffix: 'k+', label: 'Connected Chargers', iconName: 'Zap' },
    { value: 120, suffix: '+', label: 'Countries Supported', iconName: 'Globe' },
  ];

  const mapPins = [
    { x: '25%', y: '35%', name: 'Silicon Valley' },
    { x: '35%', y: '38%', name: 'New York' },
    { x: '50%', y: '28%', name: 'London' },
    { x: '53%', y: '30%', name: 'Amsterdam' },
    { x: '55%', y: '32%', name: 'Munich' },
    { x: '78%', y: '40%', name: 'Tokyo' },
    { x: '82%', y: '52%', name: 'Singapore' },
    { x: '88%', y: '78%', name: 'Sydney' },
  ];

  return (
    <section id="global" className="py-24 bg-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col space-y-4">
          <span className="text-[11px] font-bold tracking-widest text-primary uppercase">
            GLOBAL INFRASTRUCTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Enterprise-Grade Reliability on a Global Scale
          </h2>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            ScaleEV's cloud-native infrastructure is built for high availability and low latency, ensuring your charging stations remain online and accessible to drivers worldwide.
          </p>
        </div>

        {/* World Map SVG Layout */}
        <div className="relative w-full aspect-[2/1] rounded-3xl border border-border/60 bg-muted/20 overflow-hidden mb-16 p-4">
          <svg
            className="w-full h-full text-foreground/20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            viewBox="0 0 1000 500"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="opacity-[0.25]">
              {/* Lat/Long Grid Lines */}
              <line x1="0" y1="100" x2="1000" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
              <line x1="0" y1="200" x2="1000" y2="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
              <line x1="0" y1="300" x2="1000" y2="300" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
              <line x1="0" y1="400" x2="1000" y2="400" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
              <line x1="200" y1="0" x2="200" y2="500" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
              <line x1="400" y1="0" x2="400" y2="500" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
              <line x1="600" y1="0" x2="600" y2="500" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
              <line x1="800" y1="0" x2="800" y2="500" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
              
              {/* Concentric Signal Arcs */}
              <circle cx="500" cy="250" r="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
              <circle cx="500" cy="250" r="240" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
              <circle cx="500" cy="250" r="360" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
            </g>
          </svg>

          {/* Glowing Map Pins */}
          {mapPins.map((pin) => (
            <div
              key={pin.name}
              className="absolute group"
              style={{ left: pin.x, top: pin.y }}
            >
              {/* Outer pulsing ring */}
              <span className="absolute -left-1.5 -top-1.5 w-4 h-4 rounded-full bg-primary/40 animate-ping pointer-events-none" />
              {/* Inner core */}
              <span className="absolute -left-1 -top-1 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-md cursor-pointer" />
              
              {/* Label details */}
              <span className="absolute left-4 -top-3 scale-0 group-hover:scale-100 bg-background border border-border text-[9px] font-bold px-2 py-1 rounded shadow-md transition-all whitespace-nowrap z-20 pointer-events-none uppercase tracking-wider">
                {pin.name}
              </span>
            </div>
          ))}
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = iconMap[stat.iconName] || Zap;
            return (
              <div
                key={stat.label}
                className="flex flex-col space-y-2 border-l border-border/60 pl-6 group"
              >
                <div className="text-primary flex items-center space-x-2">
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <div className="text-3xl font-black tracking-tight text-foreground">
                  <AnimatedCounter value={stat.value} decimals={stat.decimals} />
                  <span className="text-primary">{stat.suffix}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
