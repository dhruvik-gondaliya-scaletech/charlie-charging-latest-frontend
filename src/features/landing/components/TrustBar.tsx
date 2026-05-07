'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function TrustBar() {
  return (
    <section className="py-20 bg-background relative overflow-hidden border-y border-border/50">
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5 opacity-50"></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-[10px] font-black tracking-[0.4em] uppercase text-muted-foreground/60 mb-12"
        >
          Powering the next generation of charging infrastructure
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-center group"
        >
          <div className="relative p-6 sm:p-8 rounded-[2rem] bg-card/30 backdrop-blur-xl border border-white/5 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:bg-card/50 w-full max-w-[280px] sm:max-w-[320px]">
            <Image
              src="/assets/charli_charging.svg"
              alt="Charli Charging"
              width={320}
              height={80}
              className="h-16 sm:h-20 w-full object-contain transition-all duration-500 group-hover:brightness-110"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
