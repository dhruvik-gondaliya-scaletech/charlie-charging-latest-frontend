'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plug, 
  ShieldCheck, 
  Zap, 
  Receipt, 
  ArrowRight,
  Workflow
} from 'lucide-react';

const workflowSteps = [
  {
    step: '01',
    title: 'Driver Connection',
    subtitle: 'OCPP Handshake',
    desc: 'Driver plugs into any certified OCPP 1.6J/2.0.1 station. The hardware transmits an instant BootNotification and Authorize handshake packet to Scale EV root broker.',
    icon: Plug,
    color: 'from-cyan-500/20 to-primary/10',
    iconColor: 'text-cyan-500',
    payload: '{"idTag": "DEADBEEF", "connectorId": 2}',
  },
  {
    step: '02',
    title: 'Instant Authorization',
    subtitle: 'Wallet Validation',
    desc: 'Platform sub-systems validate local token balances, check active location schedules, and pre-authorize billing tokens via secure TLS roaming bridges in sub-50ms.',
    icon: ShieldCheck,
    color: 'from-primary/20 to-purple-500/10',
    iconColor: 'text-primary',
    payload: '{"status": "Accepted", "expiryDate": "2026"}',
  },
  {
    step: '03',
    title: 'Optimized Delivery',
    subtitle: 'Smart Load Balancing',
    desc: 'Energy streams continuously with dynamic profile updates. Real-time meter values feed algorithms to adjust local maximum amp throughput during site peak loads.',
    icon: Zap,
    color: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-500',
    payload: '{"measurand": "Energy.Active.Import.Register"}',
  },
  {
    step: '04',
    title: 'Automated Settlement',
    subtitle: 'Payment Routing',
    desc: 'StopTransaction triggers final telemetry calculation. Stripe or Adyen capture localized taxes, trigger VAT invoice PDFs, and clear split-payouts to master tenants.',
    icon: Receipt,
    color: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-500',
    payload: '{"amount": 14.20, "currency": "USD", "cleared": true}',
  },
];

export function PlatformFlowSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section id="workflow" className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      
      {/* Immersive background layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[300px] bg-primary/5 dark:bg-primary/8 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-4 border border-primary/20">
            <Workflow className="h-3 w-3 text-primary" />
            End-to-End Orchestration
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-5">
            How Scale EV{' '}
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent block sm:inline">
              Connects the Ecosystem
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            From the raw physical metal insertion to native ledger settlement. Observe how messages transition securely through our highly distributed cloud message topology.
          </p>
        </motion.div>

        {/* Multi-step interactive workflow Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Animated SVG connecting route layer behind cards on Desktop */}
          <div className="absolute top-[85px] left-[12%] right-[12%] hidden lg:block h-0.5 bg-border/60 -z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-primary to-emerald-500"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          {workflowSteps.map((item, idx) => {
            const isHovered = activeStep === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActiveStep(idx)}
                onMouseLeave={() => setActiveStep(null)}
                className={`
                  relative rounded-2xl border bg-card/40 dark:bg-card/30 backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 group
                  ${isHovered ? 'border-primary/50 shadow-xl dark:shadow-primary/5 scale-[1.02] bg-card/80' : 'border-border/80 hover:border-border'}
                `}
              >
                {/* Step indicators */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    {/* Glowing step badge */}
                    <span className="text-xs font-black tracking-widest text-muted-foreground uppercase">
                      Step <span className="text-foreground font-mono text-base ml-0.5">{item.step}</span>
                    </span>

                    {/* Icon enclosure */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center border border-border/40 group-hover:rotate-6 transition-transform duration-300`}>
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                  </div>

                  <h4 className="text-lg font-extrabold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-bold text-primary tracking-wide uppercase mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Simulated live payload display footer */}
                <div className="mt-6 pt-4 border-t border-border/40 overflow-hidden">
                  <span className="text-[8px] font-bold tracking-widest uppercase text-muted-foreground/80 block mb-1">
                    Frame Simulator
                  </span>
                  <div className="bg-background/80 rounded p-1.5 font-mono text-[9px] text-muted-foreground truncate border border-border/40">
                    {item.payload}
                  </div>
                </div>

                {/* Micro hover connecting dots */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-background border-2 border-border group-hover:border-primary transition-colors hidden lg:block" />

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
