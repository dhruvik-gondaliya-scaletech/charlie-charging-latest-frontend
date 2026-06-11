'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Globe,
  BarChart3,
  Settings,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Zap,
  Bell,
  Users,
  MapPin,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { staggerContainer, staggerItem } from '@/lib/motion';

const features = [
  { icon: Cpu, title: 'OCPP Communication', desc: 'Full OCPP 1.6 & 2.0 protocol support for seamless hardware integration.' },
  { icon: Activity, title: 'Real-time Monitoring', desc: 'Live charger status, session tracking, and instant fault detection.' },
  { icon: CreditCard, title: 'Session & Billing', desc: 'Automated transaction management, invoicing, and revenue reconciliation.' },
  { icon: Users, title: 'Fleet & Operator Mgmt', desc: 'Role-based access control for operators, fleets, and drivers.' },
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Usage heatmaps, energy trends, and revenue forecasting dashboards.' },
  { icon: Settings, title: 'Remote Controls', desc: 'Start, stop, reset, and configure chargers remotely in real time.' },
  { icon: Zap, title: 'Energy Tracking', desc: 'Per-connector consumption monitoring with demand response support.' },
  { icon: Globe, title: 'Firmware Management', desc: 'OTA firmware updates and configuration push across your entire fleet.' },
  { icon: Bell, title: 'Alerts & Notifications', desc: 'Instant alerts for offline chargers, faults, and session anomalies.' },
  { icon: ShieldCheck, title: 'Security & RBAC', desc: 'Enterprise-grade access controls, audit logs, and TLS encryption.' },
  { icon: MapPin, title: 'Multi-Location Mgmt', desc: 'Manage hundreds of sites, zones, and charger groups from one view.' },
  { icon: Smartphone, title: 'Payment Integration', desc: 'Stripe, Apple Pay, Google Pay, and wallet-based payment support.' },
];

export function Features() {
  return (
    <section id="features" className="py-28 px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/4 blur-[120px] rounded-full pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-black tracking-[0.2em] uppercase text-[11px] mb-5">Platform Features</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              One Platform to{' '}
              <span className="text-primary">Manage Everything</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <p className="text-muted-foreground text-lg leading-relaxed">
              Scale EV brings together every tool your EV charging operation needs — from hardware communication to driver billing — in one unified, OCPP-powered platform.
            </p>
            <Link href="#contact" prefetch={false}>
              <Button className="w-fit px-6 py-5 h-auto rounded-xl font-bold text-sm group bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all">
                Explore All Features
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Central Dashboard Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-16 mx-auto max-w-4xl"
        >
          <div className="relative rounded-2xl border border-border/50 bg-card/70 backdrop-blur-xl shadow-2xl p-6 overflow-hidden">
            {/* Sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-xs text-muted-foreground font-semibold">Scale EV — Network Operations Center</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">All Systems Operational</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Chargers', value: '2,841', trend: '+12%', color: 'text-primary' },
                { label: 'Online Now', value: '2,724', trend: '96%', color: 'text-emerald-400' },
                { label: 'Revenue Today', value: '$18.4k', trend: '+8.2%', color: 'text-orange-400' },
                { label: 'Active Sessions', value: '341', trend: 'Live', color: 'text-purple-400' },
              ].map((s, i) => (
                <div key={i} className="bg-background/40 rounded-xl p-4 border border-border/30">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">{s.trend}</p>
                </div>
              ))}
            </div>

            {/* Map visualization */}
            <div className="relative h-48 rounded-xl border border-border/30 bg-background/20 overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(100, 160, 220, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 160, 220, 0.5) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }}
              />
              {[
                { top: '20%', left: '15%', active: true },
                { top: '40%', left: '35%', active: true },
                { top: '25%', left: '55%', active: false },
                { top: '60%', left: '25%', active: true },
                { top: '50%', left: '70%', active: true },
                { top: '75%', left: '50%', active: false },
                { top: '30%', left: '80%', active: true },
              ].map((dot, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ top: dot.top, left: dot.left }}
                >
                  <div className={`w-3 h-3 rounded-full border-2 ${dot.active ? 'bg-primary border-primary animate-pulse' : 'bg-muted-foreground/30 border-muted-foreground/20'}`} />
                  {dot.active && <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary/30 animate-ping" />}
                </div>
              ))}
              <div className="absolute bottom-3 left-3">
                <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/50">Live Network Map</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group p-5 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/30 hover:bg-card/70 hover:shadow-md transition-all duration-300 cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
