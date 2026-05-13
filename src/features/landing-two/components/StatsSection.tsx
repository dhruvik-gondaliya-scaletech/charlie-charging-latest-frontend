'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function useCountUp(target: number, duration = 2000, isActive = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, isActive]);
  return count;
}

interface StatItemProps {
  prefix?: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  isActive: boolean;
}

function StatItem({ prefix = '', value, suffix, label, sublabel, isActive }: StatItemProps) {
  const count = useCountUp(value, 2200, isActive);
  return (
    <div className="text-center md:text-left flex flex-col items-center md:items-start">
      <p className="text-[10px] tracking-[0.3em] font-black opacity-50 uppercase mb-4">{label}</p>
      <p className="text-5xl lg:text-6xl font-bold mb-2 tracking-tighter">
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm opacity-50 font-semibold">{sublabel}</p>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const stats = [
    { label: 'CO2 SAVED', prefix: '', value: 102060, suffix: ' kg', sublabel: 'Reduction across network' },
    { label: 'CHARGING SESSIONS', prefix: '', value: 2100000, suffix: '+', sublabel: 'Completed sessions' },
    { label: 'ENERGY DELIVERED', prefix: '', value: 241200, suffix: ' kWh', sublabel: 'Total clean energy' },
    { label: 'NETWORK UPTIME', prefix: '', value: 99, suffix: '.9%', sublabel: 'Platform reliability' },
  ];

  return (
    <section ref={ref} className="py-24 px-6 lg:px-8 bg-foreground text-background overflow-hidden relative">
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-primary font-black tracking-[0.2em] uppercase text-xs mb-4">Constant Growth</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Driving Towards A Sustainable Future</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <StatItem {...s} isActive={isInView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
