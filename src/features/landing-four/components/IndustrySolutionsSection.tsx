'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { industriesData } from '../data/evChargingData';
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
    <section id="industries" className="py-24 bg-muted/20 border-y border-border/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col space-y-4">
          <span className="text-[11px] font-bold tracking-widest text-primary uppercase">
            TAILORED SOLUTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            EV Charging Network Solutions for Every Industry
          </h2>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
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
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-md border border-border/60 bg-card cursor-pointer"
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
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent z-10" />
              </div>

              {/* Card content container */}
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between items-start">
                
                {/* Badge */}
                <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider">
                  {ind.badge}
                </span>

                {/* Details bottom section */}
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {ind.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed font-medium">
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
