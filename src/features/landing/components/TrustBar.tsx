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
          className="text-center text-xs font-black tracking-[0.3em] uppercase text-muted-foreground/60 mb-12"
        >
          Powering the next generation of charging infrastructure
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-24 w-full max-w-4xl"
        >
          <div className="relative p-4 w-full max-w-[240px] sm:max-w-[280px] flex justify-center">
            <Image
              src="/assets/charli_charging.svg"
              alt="Charli Charging"
              width={280}
              height={70}
              className="h-14 sm:h-16 w-auto object-contain"
              priority
            />
          </div>
          <div className="relative p-4 w-full max-w-[200px] flex justify-center">
            <Image
              src="/assets/collectron_energy.png"
              alt="Collectron Energy"
              width={160}
              height={91}
              className="h-14 sm:h-16 w-auto object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
