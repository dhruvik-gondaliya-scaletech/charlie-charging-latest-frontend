'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { trustedBrands } from '../data/evChargingData';

export function TrustedBrandsSection() {
  return (
    <section className="py-12 border-y border-border/40 bg-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold tracking-widest text-muted-foreground uppercase mb-8">
          Trusted by Industry Leaders and Charge Point Operators
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
          {trustedBrands.map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="flex items-center justify-center filter grayscale contrast-125 opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              {'image' in brand && brand.image ? (
                <div className="relative w-28 h-8 md:w-32 md:h-10 flex items-center justify-center">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={120}
                    height={35}
                    className="object-contain max-h-full"
                  />
                </div>
              ) : (
                <span className="text-sm md:text-base font-black tracking-[0.25em] text-foreground/60 uppercase">
                  {'logoText' in brand ? brand.logoText : brand.name}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
