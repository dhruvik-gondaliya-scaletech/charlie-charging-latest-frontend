'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Zap, BarChart3 } from 'lucide-react';

function useCountUp(target: number, duration = 2000, isActive = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
      setCount(Math.round(target * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, isActive]);
  return count;
}

const analyticsData = [
  { time: '00:00', sessions: 12, energy: 240 },
  { time: '04:00', sessions: 5, energy: 100 },
  { time: '08:00', sessions: 48, energy: 960 },
  { time: '12:00', sessions: 82, energy: 1640 },
  { time: '16:00', sessions: 95, energy: 1900 },
  { time: '20:00', sessions: 71, energy: 1420 },
  { time: '23:00', sessions: 38, energy: 760 },
];

const maxSessions = Math.max(...analyticsData.map(d => d.sessions));

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel: string;
  color: string;
  icon: React.ElementType;
  isActive: boolean;
}

function AnimatedStat({ value, suffix = '', prefix = '', label, sublabel, color, icon: Icon, isActive }: AnimatedStatProps) {
  const count = useCountUp(value, 2000, isActive);
  return (
    <div className="text-center lg:text-left">
      <div className={`inline-flex items-center gap-2 text-4xl lg:text-5xl font-bold tracking-tight ${color} mb-2`}>
        <span>{prefix}{count.toLocaleString()}{suffix}</span>
      </div>
      <p className="text-sm font-bold text-foreground mb-1">{label}</p>
      <p className="text-xs text-muted-foreground">{sublabel}</p>
    </div>
  );
}

export function AnalyticsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28 px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-black tracking-[0.2em] uppercase text-[11px] mb-5">Infrastructure Intelligence</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Real-Time Infrastructure{' '}
              <span className="text-primary">Intelligence</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            From energy heatmaps to revenue forecasts, Scale EV gives operators the live data they need to optimize every charger, every session, every day.
          </motion.p>
        </div>

        {/* Main analytics card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Chart */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Session Volume</p>
                  <p className="text-xl font-bold text-foreground">Today's Charging Activity</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">+12.4%</span>
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-3 h-52">
                {analyticsData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${(d.sessions / maxSessions) * 100}%` } : { height: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.7, ease: 'easeOut' }}
                      className="w-full rounded-t-lg bg-primary/30 hover:bg-primary/60 cursor-pointer transition-colors relative group"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.sessions} sessions
                      </div>
                    </motion.div>
                    <span className="text-[9px] text-muted-foreground/60 font-bold">{d.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="lg:w-64 flex flex-col gap-6">
              <div className="p-5 rounded-2xl bg-primary/8 border border-primary/15">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Peak Hour</p>
                </div>
                <p className="text-3xl font-bold text-primary">4–5 PM</p>
                <p className="text-xs text-muted-foreground mt-1">95 concurrent sessions</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/8 border border-emerald-500/15">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Energy Today</p>
                </div>
                <p className="text-3xl font-bold text-emerald-400">8,020 kWh</p>
                <p className="text-xs text-muted-foreground mt-1">+8.7% vs. yesterday</p>
              </div>

              <div className="p-5 rounded-2xl bg-orange-500/8 border border-orange-500/15">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Revenue</p>
                </div>
                <p className="text-3xl font-bold text-orange-400">$24,180</p>
                <p className="text-xs text-muted-foreground mt-1">This month so far</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: 2841, suffix: '', prefix: '', label: 'Chargers Managed', sublabel: 'Across all networks', color: 'text-foreground', icon: Zap },
            { value: 99, suffix: '.9%', prefix: '', label: 'Platform Uptime', sublabel: 'SLA guaranteed', color: 'text-emerald-400', icon: TrendingUp },
            { value: 241200, suffix: ' kWh', prefix: '', label: 'Energy Delivered', sublabel: 'Total this year', color: 'text-primary', icon: BarChart3 },
            { value: 18, suffix: 'k', prefix: '$', label: 'Avg Daily Revenue', sublabel: 'Per network operator', color: 'text-orange-400', icon: TrendingUp },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
            >
              <AnimatedStat {...s} isActive={isInView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
