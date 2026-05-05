'use client';

import { motion } from 'framer-motion';
import { Activity, Globe, BarChart3, Settings, Smartphone, CreditCard, ShieldCheck, Zap, Layers, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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
    <section id="features" className="py-24 px-6 lg:px-8 bg-muted/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="z-10"
          >
            <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Scalable EV Solutions</p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6 leading-tight text-foreground">
              Accelerate Your EV <br />Charging Business
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed max-w-xl">
              Scale EV provides leading technology solutions for the management, operation, and billing of electric vehicle charging stations.
            </p>
            <p className="text-muted-foreground mb-10 leading-relaxed max-w-xl">
              Whether you are building an EV charging network, managing a fleet, or running a retail business, our platform provides the tools you need to succeed in the electric revolution.
            </p>
            <Button size="lg" className="px-8 py-6 h-auto rounded-xl font-bold text-base bg-primary text-primary-foreground group">
              Plan Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-border/50">
              <Image
                src="/assets/ev_dashboard.png"
                alt="Scale EV Platform Dashboard"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Mobile App Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-10 -right-10 w-[200px] h-[400px] hidden md:block"
            >
              <div className="relative h-full w-full rounded-[2.5rem] border-8 border-foreground overflow-hidden shadow-2xl">
                <Image
                  src="/assets/ev_driver_app.png"
                  alt="Scale EV Mobile App"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
