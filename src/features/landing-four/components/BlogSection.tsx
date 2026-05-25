'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { blogsData } from '../data/evChargingData';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

export function BlogSection() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="blog" className="py-24 bg-muted/20 border-y border-border/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col space-y-4">
          <span className="text-[11px] font-bold tracking-widest text-primary uppercase">
            RESOURCES & INSIGHTS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Stay Ahead in the EV Charging Industry
          </h2>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            Explore our latest articles, guides, and industry reports to stay updated on EV charging technologies, market trends, and best practices.
          </p>
        </div>

        {/* Blog Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {blogsData.map((post) => (
            <motion.div
              key={post.title}
              variants={cardVariants}
              className="group flex flex-col justify-between border border-border/60 bg-card rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-4">
                {/* Meta header (Category & Date) */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                {/* Snippet */}
                <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                  {post.description}
                </p>
              </div>

              {/* Bottom footer bar */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/40">
                <div className="flex items-center space-x-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
