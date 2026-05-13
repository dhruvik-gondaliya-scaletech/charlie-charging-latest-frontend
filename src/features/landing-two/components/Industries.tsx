'use client';

import { motion } from 'framer-motion';
import {
  Network,
  Truck,
  Building2,
  ParkingCircle,
  Home,
  Leaf,
  BriefcaseBusiness,
  Rocket,
} from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

const industries = [
  {
    icon: Network,
    title: 'EV Charging Networks',
    desc: 'Manage public and semi-public charging networks at scale with full OCPP control.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/8',
    border: 'border-blue-500/15',
  },
  {
    icon: Truck,
    title: 'Fleet Operators',
    desc: 'Optimize depot charging, monitor fleet vehicles, and reduce energy costs.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/8',
    border: 'border-orange-500/15',
  },
  {
    icon: Building2,
    title: 'Smart Cities',
    desc: 'Deploy and manage city-wide charging infrastructure with real-time dashboards.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8',
    border: 'border-emerald-500/15',
  },
  {
    icon: ParkingCircle,
    title: 'Commercial Parking',
    desc: 'Monetize parking assets with automated billing and real-time availability.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/8',
    border: 'border-purple-500/15',
  },
  {
    icon: Home,
    title: 'Residential Communities',
    desc: 'Shared charging solutions for apartment complexes and housing developments.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/8',
    border: 'border-pink-500/15',
  },
  {
    icon: Leaf,
    title: 'Energy Providers',
    desc: 'Integrate grid-aware charging with demand response and load balancing APIs.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/8',
    border: 'border-teal-500/15',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Corporate Campuses',
    desc: 'Employee charging with access controls, billing, and usage reporting.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/8',
    border: 'border-indigo-500/15',
  },
  {
    icon: Rocket,
    title: 'EV Startups',
    desc: 'Launch your charging business faster with white-label infrastructure from day one.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/8',
    border: 'border-yellow-500/15',
  },
];

export function Industries() {
  return (
    <section className="py-28 px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background dots */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-primary font-black tracking-[0.2em] uppercase text-[11px] mb-5">Industries</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Built for Every{' '}
            <span className="text-primary">EV Ecosystem</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Whether you're a fleet operator, city planner, or startup founder — Scale EV provides the tools for your specific EV charging use case.
          </p>
        </motion.div>

        {/* Industry grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {industries.map((ind, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`group p-6 rounded-2xl border ${ind.border} ${ind.bg} hover:shadow-lg transition-all duration-300 cursor-default relative overflow-hidden`}
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/4 to-transparent transition-opacity duration-500 rounded-2xl" />

              <div className={`w-12 h-12 rounded-xl ${ind.bg} border ${ind.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <ind.icon className={`h-6 w-6 ${ind.color}`} />
              </div>

              <h3 className="font-bold text-foreground text-base mb-2.5 leading-tight">{ind.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{ind.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
