'use client';

import { motion } from 'framer-motion';
import { Smartphone, MapPin, CreditCard, Zap, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const driverFeatures = [
  { icon: MapPin, title: 'Real-time Discovery', desc: 'Find nearby chargers with live availability and filters.' },
  { icon: Zap, title: 'QR & One-Tap Start', desc: 'Instant session initiation — no signup required for guests.' },
  { icon: CreditCard, title: 'Wallet & Payments', desc: 'In-app wallet, Apple/Google Pay, and auto-invoicing.' },
  { icon: Smartphone, title: 'Live Session Tracking', desc: 'Energy, cost, and ETA displayed in real time.' },
  { icon: Star, title: 'Loyalty & Rewards', desc: 'Points, discounts, and referral programs for repeat drivers.' },
  { icon: ArrowRight, title: 'Booking & Reservations', desc: 'Reserve a charger before you arrive to guarantee availability.' },
];

// Simulated mobile app screens
function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[240px] mx-auto">
      <div className="relative rounded-[40px] border-[10px] border-foreground/90 bg-background overflow-hidden shadow-2xl aspect-[9/19]">
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-background flex items-center justify-between px-4 z-10">
          <span className="text-[9px] font-bold text-foreground/60">9:41</span>
          <div className="w-20 h-4 bg-foreground/90 rounded-full mx-auto" />
          <span className="text-[9px] font-bold text-foreground/60">100%</span>
        </div>
        <div className="pt-8 h-full">{children}</div>
      </div>
      {/* Phone shadow */}
      <div className="absolute inset-0 -z-10 bg-foreground/10 blur-[30px] rounded-[40px] scale-90 translate-y-4" />
    </div>
  );
}

export function AppPreview() {
  return (
    <section id="app" className="py-28 px-6 lg:px-8 relative overflow-hidden bg-zinc-950">
      {/* Background */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/6 blur-[140px] rounded-full pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(100, 160, 220, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 160, 220, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <span className="inline-block py-1.5 px-4 bg-primary/10 text-primary text-[10px] font-black tracking-[0.2em] rounded-full mb-7 uppercase border border-primary/20">
              White-Label Driver App
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-7 leading-tight text-white">
              Launch Your Own{' '}
              <span className="text-primary">White-Label</span>{' '}
              EV Driver App
            </h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              Scale EV provides fully customizable, white-label mobile solutions for EV charging operators. Brand it as your own — on iOS and Android — and deliver a premium driver experience from day one.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mb-10">
              {driverFeatures.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className="flex gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contact" prefetch={false}>
                <Button className="px-8 py-5 h-auto rounded-xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:scale-[1.02] transition-all group">
                  Get the App
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Phones Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative order-1 lg:order-2 flex items-end justify-center gap-4"
          >
            {/* Behind phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              animate={{ y: [0, -6, 0] }}
              style={{ animationDuration: '6s', animationIterationCount: 'infinite' }}
              className="w-[200px] mb-6 hidden sm:block"
            >
              <div className="relative rounded-[32px] border-[8px] border-zinc-800 bg-zinc-900 overflow-hidden shadow-xl aspect-[9/19]">
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 pt-10">
                  {/* Map screen */}
                  <div className="w-full h-24 rounded-xl bg-zinc-800 mb-3 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(100, 160, 220, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 160, 220, 0.4) 1px, transparent 1px)',
                        backgroundSize: '15px 15px',
                      }}
                    />
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="absolute top-2/3 left-2/3 w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Nearby Chargers</p>
                  <div className="space-y-1.5">
                    {['Downtown Hub • 0.2km', 'Mall Parking • 0.8km'].map((t, i) => (
                      <div key={i} className="flex items-center justify-between bg-zinc-800 rounded-lg p-2">
                        <span className="text-[8px] text-zinc-300 font-medium">{t}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main center phone */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <PhoneMockup>
                <div className="bg-gradient-to-b from-background to-card/50 h-full p-4">
                  {/* Charging session screen */}
                  <div className="text-center mb-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Active Session</p>
                    <p className="text-xs font-bold text-foreground">Downtown Hub — Slot 3A</p>
                  </div>

                  {/* Circular progress */}
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke="hsl(var(--primary))" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${0.78 * 264} 264`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-bold text-primary">78%</p>
                      <p className="text-[8px] text-muted-foreground font-bold">CHARGING</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[{ label: 'Power', v: '22 kW' }, { label: 'Time Left', v: '18 min' }, { label: 'Energy', v: '8.4 kWh' }, { label: 'Cost', v: '$2.40' }].map((s, i) => (
                      <div key={i} className="bg-muted/30 rounded-lg p-2 text-center">
                        <p className="text-[7px] uppercase tracking-wider text-muted-foreground/60 font-bold">{s.label}</p>
                        <p className="text-xs font-bold text-foreground">{s.v}</p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl py-2 text-[9px] font-black uppercase tracking-widest">
                    Stop Session
                  </button>
                </div>
              </PhoneMockup>
            </motion.div>

            {/* Right phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              animate={{ y: [0, -8, 0] }}
              style={{ animationDuration: '7s', animationIterationCount: 'infinite', animationDelay: '1s' }}
              className="w-[200px] mb-6 hidden sm:block"
            >
              <div className="relative rounded-[32px] border-[8px] border-zinc-800 bg-zinc-900 overflow-hidden shadow-xl aspect-[9/19]">
                <div className="absolute inset-0 bg-zinc-900 p-4 pt-10">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">Wallet Balance</p>
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-3">
                    <p className="text-[8px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Available</p>
                    <p className="text-2xl font-bold text-primary">$47.80</p>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Recent</p>
                  {['—$2.40 • Session', '+$20.00 • Top-up', '—$1.80 • Session'].map((t, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-zinc-800 py-2">
                      <span className="text-[8px] text-zinc-300 font-medium">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-xl border border-border/50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Zap className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Charging</p>
                <p className="text-sm font-bold text-foreground">78% • 18 mins left</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
