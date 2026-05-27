'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Play, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white">
      {/* Background Gradients and Blurs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none -z-10" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Text Column */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 flex flex-col space-y-8 z-10"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/55 rounded-full px-4 py-1.5 w-fit">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[12px] font-bold text-blue-700 tracking-wide uppercase">
              Next-Gen CSMS Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 leading-[1.1]"
          >
            Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">EV Charging</span> Network.
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants} 
            className="text-lg text-gray-600 max-w-xl font-medium leading-relaxed"
          >
            Hardware-agnostic OCPP management software built for global fleet operators, commercial properties, and public charging networks. Fully OCPP 2.0.1 compliant.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 items-center">
            <Link href="#demo">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.03] active:scale-[0.98] transition-all rounded-full px-8 py-6 text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2">
                Deploy Instantly <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#solutions">
              <Button variant="outline" className="border-gray-200 hover:bg-gray-50 rounded-full px-8 py-6 text-sm font-bold flex items-center gap-2">
                <Play className="w-3.5 h-3.5 fill-gray-950 text-gray-950" /> Watch Demo
              </Button>
            </Link>
          </motion.div>

          {/* Value props */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100 max-w-md"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> OCPP 1.6-J & 2.0.1 Ready
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Multi-Tenant Architecture
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Dynamic Load Balancing
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> White-Label Driver Apps
            </div>
          </motion.div>
        </motion.div>

        {/* Right Graphic/Mockup Column */}
        <div className="lg:col-span-6 relative flex justify-center items-center w-full">
          {/* Main Dashboard graphic frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80 bg-white p-2 group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none rounded-2xl" />
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src="/assets/ev_hero_dashboard.png"
                alt="ScaleEV Dashboard"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </motion.div>

          {/* Floating Panels */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="absolute top-10 -left-6 md:-left-12 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-xl p-4 shadow-xl flex items-center space-x-3 w-[200px]"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-lg">
              99%
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Uptime SLA</p>
              <p className="text-sm font-black text-gray-800">Operational</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
            className="absolute bottom-10 -right-6 md:-right-8 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-xl p-4 shadow-xl flex flex-col space-y-2 w-[220px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Substation load</span>
              <span className="text-xs font-bold text-blue-600">78% Limit</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: '78%' }} />
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Dynamic Load Balancer Active</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
