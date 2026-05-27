'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonialsData } from '../data/landingFiveData';

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[12px] font-extrabold text-blue-600 tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-6 tracking-tight">
            Trusted by top operators
          </h2>
          <p className="text-gray-500 font-medium mt-4 text-base md:text-lg">
            Hear from network owners, commercial property managers, and CPOs who use ScaleEV to run their business.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 flex flex-col justify-between hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
            >
              <div>
                {/* Rating */}
                <div className="flex space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-600 text-sm font-medium leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>
              </div>

              {/* Author profile */}
              <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-gray-200/50">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-[11px] font-semibold text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
