'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, ShieldCheck, CreditCard, ChevronRight, CheckCircle2, Wifi, Zap, Lock } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const solutions = [
  {
    id: 'mobile-app',
    icon: Smartphone,
    title: 'White-Labeled Mobile App',
    sub: 'Custom driver experience under your brand.',
    points: [
      'Assets matching your brand',
      'One-tap RFID, Apple Pay, and credit card session starts.',
      'Live map showing station availability and smart pricing.',
    ],
    mockup: {
      type: 'mobile',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop',
      title: 'Scale EV Mobile App',
      badge: 'Brand App Active',
      data: {
        networkName: 'VoltCharge App',
        status: 'Connected to Station v4',
        energy: '45.8 kWh',
        cost: '$18.32',
      }
    }
  },
  {
    id: 'csms',
    icon: ShieldCheck,
    title: 'Hardware-Agnostic CSMS',
    sub: 'OCPP compliant cloud charging management.',
    points: [
      'Full native compliance for both OCPP 1.6J and 2.0.1 networks.',
      'Remote diagnostics, reset triggers, and smart power profiles.',
      'Dynamic load management preventing local grid overloads.',
    ],
    mockup: {
      type: 'dashboard',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bbf1494801?q=80&w=800&auto=format&fit=crop',
      title: 'Charger Network CSMS',
      badge: 'OCPP 2.0.1 Live',
      data: {
        totalStations: '1,492',
        activeChargers: '94.2%',
        uptime: '99.98%',
      }
    }
  },
  {
    id: 'billing',
    icon: CreditCard,
    title: 'Automated Tariff Billing',
    sub: 'Frictionless payment splits & micro-pricing.',
    points: [
      'Instant direct-to-bank tariff splits and site payouts.',
      'Peak/off-peak pricing automation and variable rate structures.',
      'Automated PDF invoice generation and tax compliance reports.',
    ],
    mockup: {
      type: 'billing',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
      title: 'Automated Payout Ledger',
      badge: 'Stripe Connected',
      data: {
        thisMonth: '$84,103.50',
        nextPayout: 'May 24, 2026',
        commission: '100% Direct Payout',
      }
    }
  }
];

export function SolutionSection() {
  const [activeTab, setActiveTab] = useState('mobile-app');
  const currentSolution = solutions.find((s) => s.id === activeTab) || solutions[0];

  return (
    <section className="relative py-24 px-6 lg:px-8 bg-background overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-15%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-widest font-black text-primary mb-3">
            The Solution
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground sm:text-center">
            How Scale EV Solves It
          </h2>
        </div>

        {/* Side-by-Side Content */}
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* Left Column: Interactive Selector Tabs */}
          <div className="lg:col-span-6 space-y-4">
            {solutions.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeTab;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(`w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer`, isActive
                    ? 'bg-card border-primary/30 dark:bg-white/5 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
                    : 'bg-transparent border-border dark:border-white/5 hover:border-border/80 dark:hover:border-white/10'
                  )}
                >
                  <div className="flex gap-4">
                    {/* Icon container */}
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border transition-colors", isActive
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'bg-muted dark:bg-muted/80 border-border dark:border-white/5 text-muted-foreground'
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Text block */}
                    <div className="flex-1">
                      <h3 className={cn(`text-lg font-bold transition-colors`, isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>

                      {/* Expanded description (visible only when active) */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <ul className="mt-4 space-y-2 border-t border-border dark:border-white/5 pt-4">
                              {item.points.map((pt, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="self-center">
                      <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", isActive ? 'rotate-90 text-primary' : '')} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Mockup Preview Area */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[480px] aspect-square rounded-3xl bg-card/40 dark:bg-muted/40 border border-border dark:border-white/5 p-6 backdrop-blur-md overflow-hidden flex items-center justify-center">

              {/* Dynamic screen display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSolution.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex flex-col justify-between"
                >
                  {/* Visual mockup window header */}
                  <div className="flex justify-between items-center pb-4 border-b border-border dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                      <span className="text-xs font-bold text-foreground">{currentSolution.mockup.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {currentSolution.mockup.badge}
                    </span>
                  </div>

                  {/* Render content depending on active layout */}
                  <div className="my-6 relative flex-1 rounded-xl overflow-hidden border border-border dark:border-white/5 bg-background/80 dark:bg-[#0b0f17]/80">
                    <Image
                      src={currentSolution.mockup.image}
                      alt={currentSolution.mockup.title}
                      fill
                      className="object-cover opacity-30 saturate-[0.6]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized
                    />

                    {/* Details widget overlaid */}
                    {currentSolution.mockup.type === 'mobile' && (
                      <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                        <div className="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center bg-background/90 dark:bg-muted/80 mb-4 relative shadow-sm">
                          <Zap className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                        <p className="text-sm font-black text-foreground">{currentSolution.mockup.data.networkName}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{currentSolution.mockup.data.status}</p>
                        <div className="grid grid-cols-2 gap-4 mt-6 w-full pt-4 border-t border-border dark:border-white/5">
                          <div className="text-center">
                            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">CHARGED</p>
                            <p className="text-sm font-bold text-foreground">{currentSolution.mockup.data.energy}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">TOTAL COST</p>
                            <p className="text-sm font-bold text-primary">{currentSolution.mockup.data.cost}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentSolution.mockup.type === 'dashboard' && (
                      <div className="absolute inset-0 flex flex-col justify-center p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 rounded-lg bg-background/90 dark:bg-muted/80 border border-border dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-2">
                              <Wifi className="h-4 w-4 text-primary" />
                              <span className="text-xs text-foreground">Total Stations</span>
                            </div>
                            <span className="text-sm font-extrabold text-foreground">{currentSolution.mockup.data.totalStations}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-background/90 dark:bg-muted/80 border border-border dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-primary" />
                              <span className="text-xs text-foreground">Active Rate</span>
                            </div>
                            <span className="text-sm font-extrabold text-foreground">{currentSolution.mockup.data.activeChargers}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-lg bg-background/90 dark:bg-muted/80 border border-border dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-primary" />
                              <span className="text-xs text-foreground">SLA Uptime</span>
                            </div>
                            <span className="text-sm font-extrabold text-success">{currentSolution.mockup.data.uptime}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentSolution.mockup.type === 'billing' && (
                      <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-background/90 dark:bg-muted/90 border border-primary/20 flex items-center justify-center mb-4 shadow-sm">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-2xl font-black text-foreground">{currentSolution.mockup.data.thisMonth}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Processed Revenue</p>
                        <div className="mt-6 flex flex-col items-center gap-1.5 w-full bg-background/90 dark:bg-muted/80 p-3 rounded-xl border border-border dark:border-white/5 shadow-sm">
                          <div className="flex items-center gap-1.5 text-xs text-foreground">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span>Next Automatic Payout: <strong className="text-foreground">{currentSolution.mockup.data.nextPayout}</strong></span>
                          </div>
                          <span className="text-[9px] text-success bg-success/10 px-2 py-0.5 rounded-full font-bold">
                            {currentSolution.mockup.data.commission}
                          </span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Microcopy prompt on bottom of preview */}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Real-time platform simulation data</span>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
