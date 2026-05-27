'use client';

import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { solutionsData } from '../data/landingFiveData';

export function SolutionsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="solutions" className="py-24 bg-gray-50/50 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-blue-100/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-100/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[12px] font-extrabold text-blue-600 tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full">
            Our Solutions
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-6 tracking-tight">
            Complete charging management software
          </h2>
          <p className="text-gray-500 font-medium mt-4 text-base md:text-lg">
            ScaleEV offers an all-in-one suite of tools tailored to operators, property owners, and fleets looking to electrify seamlessly.
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
          {solutionsData.map((solution) => {
            // Dynamically resolve icon component
            const IconComponent = (Icons as any)[solution.iconName] || Icons.HelpCircle;

            return (
              <motion.div
                key={solution.id}
                variants={cardVariants}
                className="bg-white border border-gray-200/80 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {solution.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50/70 px-2.5 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
                        {solution.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {solution.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium mt-3 leading-relaxed">
                    {solution.description}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-2">
                    {solution.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-xs font-bold text-gray-600">
                        <Icons.Check className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
