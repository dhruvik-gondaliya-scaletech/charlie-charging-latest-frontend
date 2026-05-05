'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Battery, Zap, Shield, BarChart3, Cloud } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

export function SolutionsGrid() {
  const solutions = [
    {
      title: "White-Label EV Charging Platform",
      description: "Scale your business with our cloud-based charging software, fully customizable with your brand identity.",
      icon: Cloud,
      link: "Read more →"
    },
    {
      title: "Energy & Grid Management",
      description: "Optimized power distribution and load balancing to ensure maximum efficiency across your network.",
      icon: Battery,
      link: "Read more →"
    },
    {
      title: "Telemetry & API Solutions",
      description: "Comprehensive API suite for seamless integration with your existing enterprise systems and hardware.",
      icon: BarChart3,
      link: "Read more →"
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-background relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Platform Solutions</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Solutions To Match Your EV Charging Business</h2>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {solutions.map((s, idx) => (
            <motion.div key={idx} variants={staggerItem}>
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group rounded-2xl overflow-hidden">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                  <p className="text-muted-foreground mb-8 line-clamp-3">{s.description}</p>
                  <button className="text-primary font-bold text-sm mt-auto hover:underline flex items-center gap-2">
                    {s.link}
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
