'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonialsData } from '../data/evChargingData';

export function TestimonialsSection() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="testimonials" className="py-24 bg-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col space-y-4">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Trusted by Leading EV Infrastructure Providers
          </h2>
          <p className="text-muted-foreground text-base font-medium leading-relaxed">
            Read stories from fleet managers, real estate operators, and charging service providers who use ScaleEV to build and scale their EV charging networks.
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {testimonialsData.map((t) => (
            <motion.div
              key={t.name}
              variants={itemVariants}
              className="relative rounded-3xl border border-border/60 bg-card p-8 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Quote details */}
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <p className="text-foreground/90 font-medium text-base leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Profile details */}
              <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-border/40">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border bg-muted">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold tracking-tight text-foreground">
                    {t.name}
                  </h4>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t.role}, <span className="text-primary">{t.company}</span>
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
