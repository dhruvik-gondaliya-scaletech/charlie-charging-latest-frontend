'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, Zap, Shield, BarChart3, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

const metrics = [
  { icon: Activity, label: '99.9% Uptime', desc: 'Guaranteed SLA' },
  { icon: Zap, label: 'Real-time', desc: 'Live monitoring' },
  { icon: Shield, label: 'OCPP 1.6 & 2.0', desc: 'Fully compliant' },
  { icon: BarChart3, label: 'Smart Energy', desc: 'AI-driven insights' },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background">
      {/* === Layered Cinematic Background === */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(var(--primary-rgb, 100 160 220) / 1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary-rgb, 100 160 220) / 1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow orbs */}
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-primary/8 blur-[140px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[100px]" />
        </motion.div>
        {/* Top gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/80" />
      </div>

      {/* === Main Content === */}
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary text-[11px] font-black tracking-[0.2em] uppercase mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              OCPP-Powered EV Infrastructure
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-8 text-foreground"
            >
              Own Your EV{' '}
              <span className="relative">
                <span className="text-primary">Charging</span>
              </span>{' '}
              Operations{' '}
              <span className="text-muted-foreground/50">Infrastructure</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg lg:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Scale EV empowers charging operators, fleet businesses, and EV infrastructure providers with a complete OCPP-powered management ecosystem — from hardware to driver experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 mb-14"
            >
              <Link href="#contact" prefetch={false}>
                <Button
                  size="lg"
                  className="px-8 py-6 h-auto rounded-xl font-bold text-base shadow-2xl shadow-primary/25 hover:scale-[1.03] hover:shadow-primary/35 transition-all duration-300 bg-primary text-primary-foreground group"
                >
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#features" prefetch={false}>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 h-auto rounded-xl border-border/60 font-bold text-base hover:bg-accent/40 hover:border-primary/30 transition-all duration-300 backdrop-blur-sm"
                >
                  Explore Platform
                </Button>
              </Link>
            </motion.div>

            {/* Trust snippet */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {['bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500'].map((c, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-background flex items-center justify-center`}>
                    <span className="text-white text-[8px] font-bold">{String.fromCharCode(65 + i)}</span>
                  </div>
                ))}
              </div>
              <span>Trusted by <strong className="text-foreground">50+ operators</strong> globally</span>
            </motion.div>
          </div>

          {/* Right: Visual Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            {/* Main dashboard card */}
            <div className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden p-6">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/60 mb-1">Scale EV Platform</p>
                  <p className="text-lg font-bold text-foreground">Operations Dashboard</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-400">Live</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Active Chargers', value: '1,284', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Sessions Today', value: '8,421', color: 'text-primary', bg: 'bg-primary/10' },
                  { label: 'kWh Delivered', value: '42.8k', color: 'text-orange-400', bg: 'bg-orange-500/10' },
                ].map((s, i) => (
                  <div key={i} className={`rounded-xl p-4 ${s.bg}`}>
                    <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/70 mb-1">{s.label}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Fake chart bars */}
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-3">Energy Load (24h)</p>
                <div className="flex items-end gap-1.5 h-20">
                  {[35, 55, 48, 72, 65, 88, 95, 78, 85, 70, 60, 75, 90, 82, 68, 74, 88, 96, 84, 70, 60, 52, 45, 40].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.03, duration: 0.6, ease: 'easeOut' }}
                      className="flex-1 rounded-sm bg-primary/30 hover:bg-primary/60 transition-colors cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              {/* Charger status list */}
              <div className="space-y-2">
                {[
                  { id: 'CHG-001', location: 'Downtown Hub', status: 'Charging', power: '22 kW' },
                  { id: 'CHG-002', location: 'Airport Terminal', status: 'Available', power: '—' },
                  { id: 'CHG-003', location: 'Mall Parking', status: 'Charging', power: '50 kW' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${c.status === 'Charging' ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
                      <div>
                        <p className="text-xs font-bold text-foreground">{c.id}</p>
                        <p className="text-[10px] text-muted-foreground">{c.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${c.status === 'Charging' ? 'text-emerald-400' : 'text-muted-foreground'}`}>{c.status}</p>
                      <p className="text-[10px] text-primary">{c.power}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating notification card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-8 -left-12 bg-card/90 backdrop-blur-2xl border border-border/60 p-4 rounded-2xl shadow-2xl z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">Session Active</p>
                  <p className="text-sm font-bold text-foreground">84% • 12 mins left</p>
                </div>
              </div>
            </motion.div>

            {/* Background glow behind card */}
            <div className="absolute -inset-4 bg-primary/5 blur-[60px] rounded-3xl -z-10" />
          </motion.div>
        </div>

        {/* === Bottom Metrics Bar === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metrics.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <m.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{m.label}</p>
                <p className="text-[11px] text-muted-foreground">{m.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
