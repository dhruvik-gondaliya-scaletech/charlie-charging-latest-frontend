'use client';

import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { featuresData } from '../data/landingFiveData';

export function FeaturesGridSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[12px] font-extrabold text-blue-600 tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-6 tracking-tight">
            Designed for performance and reliability
          </h2>
          <p className="text-gray-500 font-medium mt-4 text-base md:text-lg">
            ScaleEV is loaded with industry-standard features to optimize load scheduling, billing, and system operations.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresData.map((feature, idx) => {
            const IconComponent = (Icons as any)[feature.iconName] || Icons.HelpCircle;

            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="p-8 rounded-2xl border border-gray-100 hover:border-blue-500/10 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/10 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium mt-3 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
