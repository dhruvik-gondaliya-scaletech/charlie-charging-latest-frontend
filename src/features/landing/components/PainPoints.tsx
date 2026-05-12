'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Eye,
  CreditCard,
  TrendingUp,
  Users,
  Layers,
  BarChart2,
  Clock,
} from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

const painPoints = [
  {
    icon: Layers,
    title: 'No Centralized Management',
    desc: 'Juggling multiple fragmented tools and dashboards to manage your charging network creates operational chaos.',
    color: 'text-red-400',
    bg: 'bg-red-500/8',
    border: 'border-red-500/15',
  },
  {
    icon: Eye,
    title: 'Difficult Charger Monitoring',
    desc: 'Lack of real-time visibility into charger health, availability, and usage patterns slows incident response.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/8',
    border: 'border-orange-500/15',
  },
  {
    icon: CreditCard,
    title: 'Poor Transaction Visibility',
    desc: 'Incomplete billing records and session data lead to revenue leakage and unresolved driver disputes.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/8',
    border: 'border-yellow-500/15',
  },
  {
    icon: TrendingUp,
    title: 'Limited Scalability',
    desc: 'Legacy systems buckle under growth pressure, making it painful to onboard new sites and chargers.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8',
    border: 'border-emerald-500/15',
  },
  {
    icon: Users,
    title: 'Complex Driver Experience',
    desc: 'Clunky apps and unclear charging flows frustrate drivers and reduce loyalty to your network.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/8',
    border: 'border-blue-500/15',
  },
  {
    icon: AlertTriangle,
    title: 'Disconnected Systems',
    desc: 'Payment platforms, charger firmware, and CRM tools don\'t talk to each other — creating data silos.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/8',
    border: 'border-purple-500/15',
  },
  {
    icon: BarChart2,
    title: 'Weak Reporting & Analytics',
    desc: 'Without actionable data, optimizing pricing, utilization, and energy costs becomes guesswork.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/8',
    border: 'border-pink-500/15',
  },
  {
    icon: Clock,
    title: 'Operational Inefficiencies',
    desc: 'Downtime, manual workflows, and slow firmware updates drain your team\'s time and erode margins.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/8',
    border: 'border-cyan-500/15',
  },
];

export function PainPoints() {
  return (
    <section className="py-28 px-6 lg:px-8 relative overflow-hidden bg-muted/5">
      {/* Grid decoration */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <p className="text-primary font-black tracking-[0.2em] uppercase text-[11px] mb-5">
            The Challenge
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            The Challenges of Modern{' '}
            <span className="text-primary">EV Infrastructure</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            EV operators face a maze of disconnected tools, limited visibility, and scaling pains.
            Scale EV was built to solve every one of them.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {painPoints.map((p, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative p-6 rounded-2xl border ${p.border} ${p.bg} backdrop-blur-sm group cursor-default overflow-hidden transition-all duration-300 hover:shadow-lg`}
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/3 to-transparent rounded-2xl" />

              <div className={`w-11 h-11 rounded-xl ${p.bg} border ${p.border} flex items-center justify-center mb-5`}>
                <p.icon className={`h-5 w-5 ${p.color}`} />
              </div>
              <h3 className="font-bold text-foreground mb-2.5 text-base leading-tight">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
