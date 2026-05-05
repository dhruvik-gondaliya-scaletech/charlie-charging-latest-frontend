'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FeaturesCarousel() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Slanted Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent -skew-y-3 origin-left scale-110"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Software Advantage</p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">Customer Focused EV Charging Software</h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-xl">
              Scale EV software is designed with the end-user in mind. From intuitive driver apps to powerful management dashboards, we provide the tools you need to build a loyal customer base and grow your network.
            </p>
            <Button className="px-8 py-6 h-auto rounded-xl font-bold text-base bg-foreground text-background hover:bg-foreground/90 transition-all group">
              Learn more
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { title: "Smart Scheduling", desc: "Automate charging sessions based on grid demand." },
              { title: "Real-time Alerts", desc: "Get notified instantly of any network issues." },
              { title: "User Insights", desc: "Understand driver behavior with deep analytics." },
              { title: "Secure Payments", desc: "Integrated payment processing with multi-currency support." }
            ].map((item, idx) => (
              <div key={idx} className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all shadow-sm">
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
