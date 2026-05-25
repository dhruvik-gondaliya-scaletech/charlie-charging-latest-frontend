'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { blogsData } from '../data/landingFiveData';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BlogSection() {
  return (
    <section id="blog" className="py-24 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-xl">
            <span className="text-[12px] font-extrabold text-blue-600 tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full">
              Latest Insights
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-6 tracking-tight">
              Resources and guides
            </h2>
            <p className="text-gray-500 font-medium mt-4 text-sm md:text-base">
              Learn how to launch, optimize, and monetize your electric vehicle charging business with guides from our experts.
            </p>
          </div>
          <Button variant="outline" className="mt-6 md:mt-0 font-bold border-gray-200 hover:bg-gray-100/50 rounded-full px-6 flex items-center gap-2">
            View All Posts <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogsData.map((blog, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-50">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {blog.category}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {blog.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-xs font-medium mt-3 leading-relaxed">
                    {blog.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-[11px] font-bold text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {blog.date}
                  </span>
                  <span className="text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
