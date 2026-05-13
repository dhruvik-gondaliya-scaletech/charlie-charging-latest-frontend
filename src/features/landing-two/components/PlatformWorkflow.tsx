'use client';

import { motion } from 'framer-motion';
import { Zap, ArrowRight, Wifi, BarChart3, Smartphone, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Zap,
    label: 'Charging Station',
    desc: 'OCPP-compatible hardware at any site',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    icon: Wifi,
    label: 'OCPP Communication',
    desc: 'Secure, real-time protocol handshake',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: BarChart3,
    label: 'Scale EV Platform',
    desc: 'Central management & intelligence layer',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    icon: TrendingUp,
    label: 'Monitoring & Analytics',
    desc: 'Real-time insights and operational data',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: Smartphone,
    label: 'Driver App',
    desc: 'White-label mobile experience',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
];

export function PlatformWorkflow() {
  return (
    <section className="py-28 px-6 lg:px-8 bg-muted/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(100,160,220,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,220,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
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
          <p className="text-primary font-black tracking-[0.2em] uppercase text-[11px] mb-5">Platform Architecture</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            How Scale EV <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From the charger on the wall to the driver's phone — one seamless, intelligent flow.
          </p>
        </motion.div>

        {/* Horizontal flow */}
        <div className="relative">
          {/* Connector line */}
          <div className="absolute top-[52px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center lg:items-start">
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  className="w-full lg:pr-6"
                >
                  {/* Icon circle */}
                  <div className={`relative w-[104px] h-[104px] rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-6 mx-auto lg:mx-0 shadow-sm group`}>
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                    {/* Step number */}
                    <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-background border border-border/60 flex items-center justify-center">
                      <span className="text-[10px] font-black text-muted-foreground">{i + 1}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-foreground text-base mb-2 text-center lg:text-left">{step.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center lg:text-left">{step.desc}</p>
                </motion.div>

                {/* Arrow between steps */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-[52px] right-0 translate-x-1/2 -translate-y-1/2 z-10">
                    <div className={`w-8 h-8 rounded-full bg-background border border-border/60 flex items-center justify-center shadow-sm`}>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-semibold text-muted-foreground">
              Real-time data flow from hardware to insights in <strong className="text-foreground">under 500ms</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
