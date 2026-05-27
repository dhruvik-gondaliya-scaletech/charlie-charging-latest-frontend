'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { industriesData } from '../data/landingFiveData';
import { ArrowUpRight } from 'lucide-react';

export function IndustrySolutionsSection() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="industries" className="py-24 bg-gray-50/50 border-y border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col space-y-4">
          <span className="text-[12px] font-extrabold text-blue-600 tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full w-fit mx-auto">
            TAILORED SOLUTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mt-4">
            EV Charging Network Solutions for Every Industry
          </h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            ScaleEV offers customized software solutions to meet the specific requirements of various sectors, helping businesses manage charging networks efficiently.
          </p>
        </div>

        {/* Industries Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {industriesData.map((ind) => (
            <motion.div
              key={ind.title}
              variants={cardVariants}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-md border border-gray-200/80 bg-white cursor-pointer"
            >
              {/* Image Frame */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={ind.image}
                  alt={ind.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {/* Visual Gradient Mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
              </div>

              {/* Card content container */}
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between items-start">
                
                {/* Badge */}
                <span className="text-[10px] font-bold text-blue-600 bg-white border border-blue-100 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider">
                  {ind.badge}
                </span>

                {/* Details bottom section */}
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                      {ind.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed font-medium">
                    {ind.description}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
