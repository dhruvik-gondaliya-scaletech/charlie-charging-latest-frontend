'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  CreditCard, 
  BatteryCharging, 
  Calendar, 
  DollarSign, 
  LineChart, 
  Gift, 
  Radio, 
  ArrowRight,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const appFeatures = [
  { icon: MapPin, title: 'Charger Discovery', desc: 'Real-time routing with advanced connector type, speed, and active queue filtering.' },
  { icon: CreditCard, title: 'Wallet System', desc: 'Pre-loadable digital wallets supporting auto-reload and automated localized tax VAT rules.' },
  { icon: BatteryCharging, title: 'Live Sessions', desc: 'Granular telemetry updates showing instantaneous state of charge, kW curve, and ETA.' },
  { icon: Calendar, title: 'Reservations', desc: 'Pre-booking capability ensuring guaranteed parking bay availability upon arrival.' },
  { icon: DollarSign, title: 'Payment Systems', desc: 'Secure tokenized native checkouts supporting Apple Pay, Google Pay, and credit card roaming.' },
  { icon: LineChart, title: 'Driver Analytics', desc: 'Personalized driving metrics tracking monthly energy spend, carbon offset, and session histories.' },
  { icon: Gift, title: 'Rewards & Loyalty', desc: 'Customizable cash-back point incentives and loyalty multipliers for frequent network drivers.' },
  { icon: Radio, title: 'Real-Time Updates', desc: 'Frictionless background push notifications for charge completion, stall warnings, and dynamic rates.' },
];

// Helper helper for Glassmorphic Smartphone frames
function GlassPhoneMockup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative w-[250px] sm:w-[270px] shrink-0 ${className}`}>
      {/* Phone shadow/backplate */}
      <div className="absolute inset-0 bg-gradient-to-tr from-foreground/10 via-primary/10 to-transparent blur-2xl rounded-[48px] transform translate-y-6 scale-90 -z-10" />

      {/* Main Bezel Frame */}
      <div className="relative rounded-[44px] border-[10px] border-border/80 dark:border-white/10 bg-background overflow-hidden shadow-2xl aspect-[9/19]">
        
        {/* Dynamic Notch / Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-7 bg-background flex items-center justify-between px-5 z-20">
          <span className="text-[9px] font-black tracking-tighter text-foreground">9:41</span>
          <div className="w-16 h-3 bg-foreground/90 dark:bg-white/20 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2" />
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black tracking-tighter text-foreground">5G</span>
          </div>
        </div>

        {/* Screen container */}
        <div className="pt-7 h-full flex flex-col relative overflow-hidden bg-gradient-to-b from-background via-card/50 to-background">
          {children}
        </div>

      </div>
    </div>
  );
}

export function WhiteLabelAppSection() {
  return (
    <section id="driver-app" className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background border-t border-border/60 dark:border-white/5">
      
      {/* Futuristic soft gradient backdrop mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] right-[10%] w-[600px] h-[600px] bg-primary/8 dark:bg-primary/12 blur-[170px] rounded-full" />
        <div className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full" />
        
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(var(--primary-rgb, 100, 100, 100), 1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary-rgb, 100, 100, 100), 1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Description Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-5 border border-primary/20">
              <Sparkles className="h-3 w-3 text-primary animate-spin duration-3000" />
              Customizable White-Label Ecosystem
            </span>

            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.08] mb-6">
              Launch Your Own{' '}
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent block sm:inline">
                White-Label EV Driver
              </span>{' '}
              Ecosystem
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
              Scale EV provides fully customizable white-label driver applications for EV charging operators and infrastructure businesses. Deploy flawlessly branded native mobile interfaces without managing mobile engineering silos.
            </p>

            {/* Micro-Interaction Grid Feature List */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {appFeatures.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-card/60 border border-border/80 dark:border-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-all duration-300 text-muted-foreground mt-0.5">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">{item.title}</h5>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contact">
                <Button className="px-8 py-6 h-auto rounded-xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all group">
                  Preview Your App
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" className="px-8 py-6 h-auto rounded-xl border-border/80 dark:border-white/10 font-bold hover:bg-muted/50 transition-all backdrop-blur-sm">
                Request API Stubs
              </Button>
            </div>

          </motion.div>

          {/* Right Column: Immersive Overlapping Mockups with Ambient Glows */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-2 pt-6 lg:pt-0"
          >
            {/* Phone 1: Discovery & Map layers */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <GlassPhoneMockup>
                {/* Internal App Navigation Layout preview */}
                <div className="p-3 bg-card/60 border-b border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <Smartphone className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-[10px] font-extrabold text-foreground tracking-tight">VoltLink Go</span>
                  </div>
                  <span className="text-[8px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-black uppercase">Active Filter</span>
                </div>

                {/* Map Screen graphic */}
                <div className="flex-1 p-3 flex flex-col justify-between relative overflow-hidden">
                  {/* Subtle algorithmic road overlay */}
                  <div className="absolute inset-0 bg-muted/30">
                    <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0,50 Q100,20 250,80 T300,200" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" />
                      <path d="M50,0 L50,300" fill="none" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>
                    {/* Pulsing Target nodes */}
                    <span className="absolute top-12 left-1/3 w-3 h-3 rounded-full bg-primary animate-ping" />
                    <span className="absolute top-12 left-1/3 w-3 h-3 rounded-full bg-primary border-2 border-white" />

                    <span className="absolute bottom-16 right-10 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                  </div>

                  <div className="relative z-10">
                    <div className="bg-background/90 backdrop-blur-md p-2 rounded-xl border border-border/60 shadow-sm mb-2">
                      <p className="text-[8px] font-black uppercase text-muted-foreground">Nearby High-Speed Hub</p>
                      <p className="text-xs font-bold text-foreground">Metro Station Plaza</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">4 / 6 Available</span>
                        <span className="text-[9px] text-muted-foreground">• 350 kW</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-1.5">
                    <div className="bg-background/90 backdrop-blur-md p-2 rounded-xl border border-border/60 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-bold text-foreground">HyperFast Stall 4</p>
                        <p className="text-[8px] text-muted-foreground">$0.42 / kWh</p>
                      </div>
                      <span className="text-[8px] font-black bg-primary text-primary-foreground px-2 py-1 rounded-lg">Reserve</span>
                    </div>
                  </div>
                </div>
              </GlassPhoneMockup>
            </motion.div>

            {/* Phone 2: Live Charging Feed & Wallet (Offset layered behind/beside) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="relative sm:-ml-12 sm:mt-16 z-20"
            >
              <GlassPhoneMockup className="border-primary/20 dark:border-primary/40">
                
                {/* Active Session Frame */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-card/80 to-background">
                  
                  <div className="text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 inline-block mb-1">
                      Live Stream Active
                    </span>
                    <p className="text-xs font-extrabold text-foreground">Stall 2B — HyperLink</p>
                  </div>

                  {/* Circular SOC display */}
                  <div className="relative w-28 h-28 mx-auto my-3 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="40" fill="none"
                        stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${0.84 * 251.2} 251.2`}
                      />
                    </svg>
                    <div className="text-center">
                      <p className="text-2xl font-black text-primary leading-tight">84%</p>
                      <p className="text-[7px] font-bold tracking-widest text-muted-foreground uppercase">Charged</p>
                    </div>
                  </div>

                  {/* Live metrics widgets */}
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    <div className="bg-muted/50 p-2 rounded-lg text-center border border-border/40">
                      <p className="text-[7px] font-black uppercase text-muted-foreground">Delivery</p>
                      <p className="text-xs font-bold text-foreground">148 kW</p>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-lg text-center border border-border/40">
                      <p className="text-[7px] font-black uppercase text-muted-foreground">Session Fee</p>
                      <p className="text-xs font-bold text-primary">$14.20</p>
                    </div>
                  </div>

                  {/* Wallet quick glance */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-2.5 text-left">
                    <p className="text-[8px] font-black uppercase text-muted-foreground">Linked Wallet</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs font-extrabold text-foreground">Auto-Reload On</span>
                      <span className="text-xs font-black text-primary">$85.00</span>
                    </div>
                  </div>

                </div>

              </GlassPhoneMockup>

              {/* Floating Feature Tags positioned around phones */}
              <div className="absolute -bottom-6 left-6 bg-card/90 backdrop-blur-xl border border-border/80 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                <Gift className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-bold text-foreground">Native Loyalty hooks</span>
              </div>

            </motion.div>

            {/* Custom UI particles tag floating */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-0 right-0 hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full z-30 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">Push Ready</span>
            </motion.div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
