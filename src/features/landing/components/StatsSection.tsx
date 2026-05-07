'use client';

import { motion } from 'framer-motion';

export function StatsSection() {
  const stats = [
    {
      label: "CO2 SAVED",
      value: "102,060 kg",
      sublabel: "Reduction across network"
    },
    {
      label: "CHARGING SITES",
      value: "17,460",
      sublabel: "Active charging points"
    },
    {
      label: "ENERGY DELIVERED",
      value: "241,200 kWh",
      sublabel: "Total clean energy"
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-foreground text-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Constant Growth</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Driving Towards A Sustainable Future</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
          {stats.map((s, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center md:text-left flex flex-col"
            >
              <p className="text-[10px] tracking-[0.3em] font-black opacity-50 uppercase mb-4">{s.label}</p>
              <p className="text-4xl lg:text-5xl font-bold mb-2 tracking-tighter">{s.value}</p>
              <p className="text-xs opacity-40 font-medium">{s.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative background circle */}
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
    </section>
  );
}
