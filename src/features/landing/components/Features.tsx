'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Globe, BarChart3, Settings, Smartphone, CreditCard, ShieldCheck, Zap, Layers } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

const features = [
  {
    icon: Activity,
    title: 'Real-time Pulse',
    description: 'Sub-second latency status tracking for every connector in your fleet.',
    className: 'md:col-span-2 lg:col-span-2',
    gradient: 'from-blue-500/10 to-transparent'
  },
  {
    icon: ShieldCheck,
    title: 'OCPP 1.6 Support',
    description: 'Battle-tested EV charging protocol handling for maximum reliability.',
    className: 'md:col-span-1 lg:col-span-1',
    gradient: 'from-emerald-500/10 to-transparent'
  },
  {
    icon: Smartphone,
    title: 'Driver Delight',
    description: 'A premium PWA that makes charging feel like magic.',
    className: 'md:col-span-1 lg:col-span-1',
    gradient: 'from-purple-500/10 to-transparent'
  },
  {
    icon: CreditCard,
    title: 'Instant Clearing',
    description: 'Automated billing and payouts powered by Stripe integration.',
    className: 'md:col-span-1 lg:col-span-1',
    gradient: 'from-orange-500/10 to-transparent'
  },
  {
    icon: Globe,
    title: 'Hardware Agnostic',
    description: 'Connect any OCPP-compliant charger to our platform instantly.',
    className: 'md:col-span-1 lg:col-span-1',
    gradient: 'from-cyan-500/10 to-transparent'
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Actionable insights derived from every session and every watt.',
    className: 'md:col-span-2 lg:col-span-3',
    gradient: 'from-pink-500/10 to-transparent'
  }
];

export function Features() {
  return (
    <section id="features" className="py-32 px-8 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4"
            >
              The Core Engine
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[0.95] text-foreground"
            >
              Master complexity <br />through <span className="text-muted-foreground">precision.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg font-medium max-w-sm mb-2"
          >
            Every session, every station, every watt. Managed from a singular, high-performance interface.
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={staggerItem} className={feature.className}>
              <Card className="h-full border border-border/50 bg-card/30 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all duration-500 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                <CardContent className="p-10 relative z-10 h-full flex flex-col">
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl shadow-primary/5">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium flex-1">
                    {feature.description}
                  </p>
                  <div className="mt-8 pt-8 border-t border-border/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center text-primary font-black text-[10px] uppercase tracking-widest gap-2">
                    Learn more <Zap className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
