'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

const tiers = [
  {
    name: 'Starter',
    price: '$49',
    description: 'Perfect for small business owners and startups.',
    features: [
      'Up to 5 Charging Stations',
      'Real-time Monitoring',
      'Basic Analytics',
      'OCPP 1.6 Support',
      'Standard Support'
    ]
  },
  {
    name: 'Professional',
    price: '$199',
    description: 'Ideal for growing networks and regional operators.',
    features: [
      'Up to 50 Charging Stations',
      'Advanced Analytics',
      'Advanced Telemetry',
      'Multi-site Management',
      'Custom Branding',
      'Priority Support'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full-scale solutions for global charging networks.',
    features: [
      'Unlimited Charging Stations',
      'White-label PWA',
      'Dedicated Account Manager',
      'SLA & Uptime Guarantee',
      'Custom Integrations',
      'On-premise Deployment'
    ]
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-8 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold tracking-tighter mb-6 text-foreground"
          >
            Scalable pricing for <br />every network.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium"
          >
            Transparent plans designed to grow with your infrastructure. No hidden fees, just pure performance.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {tiers.map((tier, idx) => (
            <motion.div key={idx} variants={staggerItem} className="relative group">
              <div className={`
                h-full flex flex-col p-8 rounded-[2rem] border transition-all duration-500
                ${tier.popular
                  ? 'bg-card/80 backdrop-blur-2xl border-primary/20 shadow-2xl shadow-primary/10 scale-105 z-10'
                  : 'bg-card/40 backdrop-blur-xl border-border/50 hover:border-primary/20 hover:bg-card/60 shadow-none hover:shadow-xl'
                }
              `}>
                {tier.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
                    Most Popular
                  </span>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    {tier.price !== 'Custom' && <span className="text-muted-foreground text-sm">/mo</span>}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.popular ? 'default' : 'outline'}
                  className={`w-full py-6 rounded-xl font-bold transition-all duration-300 ${tier.popular ? 'shadow-xl shadow-primary/20 hover:scale-[1.02]' : 'hover:border-foreground hover:bg-accent'}`}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
