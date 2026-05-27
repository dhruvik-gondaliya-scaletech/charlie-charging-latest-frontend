'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { trustedBrands } from '../data/landingFiveData';

export function TrustedBrandsSection() {
  return (
    <section className="py-12 border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
          Trusted by Industry Leaders Worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 opacity-65 hover:opacity-100 transition-opacity duration-300">
          {trustedBrands.map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-200">
                <span className="text-[10px] font-black text-gray-400 group-hover:text-blue-500">⚡</span>
              </div>
              <span className="text-sm font-bold tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors duration-200">
                {brand.logoText}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
