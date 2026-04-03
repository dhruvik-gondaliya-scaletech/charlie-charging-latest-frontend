'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Globe, BarChart3, Settings, ArrowRight } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

export function Features() {
  const features = [
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Live station status and session tracking with sub-second latency.',
    },
    {
      icon: Globe,
      title: 'OCPI Roaming',
      description: 'Seamless roaming integration with worldwide partners out of the box.',
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Deep insights into energy usage, station performance, and revenue.',
    },
    {
      icon: Settings,
      title: 'Remote Ops',
      description: 'Start/Stop, Unlock, and Firmware updates remotely from any device.',
    }
  ];

  return (
    <section id="features" className="py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold tracking-tighter mb-6 leading-tight text-black"
            >
              Mastering complexity through <br />refined operations.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#474747] text-lg font-medium"
            >
              Every session, every station, every watt. Managed from a singular, high-performance interface designed for the next era of mobility.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pb-2"
          >
            <a href="#" className="group font-bold flex items-center gap-2 hover:opacity-70 transition-opacity text-black">
              View all capabilities 
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={staggerItem}>
              <Card className="h-full border border-black/5 bg-white backdrop-blur-xl rounded-2xl hover:bg-[#f3f3f4] transition-all duration-300 group p-8 shadow-none">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-8 group-hover:-translate-y-2 transition-transform duration-500 shadow-xl shadow-black/10">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-black">{feature.title}</h3>
                  <p className="text-[#474747] leading-relaxed text-sm font-medium">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
