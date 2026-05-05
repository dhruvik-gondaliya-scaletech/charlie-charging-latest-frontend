'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function GlobalNetwork() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Global Reach</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">Powering EV Charging Networks Across Multiple Countries</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Scale EV is designed for scalability across borders. Our multi-currency, multi-language, and multi-timezone support ensures your network can grow anywhere in the world.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-full aspect-[21/9] bg-muted/20 rounded-[3rem] overflow-hidden border border-border/50"
        >
          {/* Using a high-quality world map placeholder */}
          <Image
            src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2070&auto=format&fit=crop"
            alt="Global Network Map"
            fill
            className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
            unoptimized
          />
          
          {/* Animated pings for locations */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-primary rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
}
