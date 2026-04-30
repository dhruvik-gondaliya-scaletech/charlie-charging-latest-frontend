'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Smartphone, Zap, MapPin, CreditCard } from 'lucide-react';

export function AppPreview() {
  return (
    <section id="app" className="py-24 px-8 bg-zinc-950 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="z-10"
        >
          <span className="inline-block py-1 px-3 bg-primary/10 text-primary text-[10px] font-black tracking-widest rounded-full mb-6 uppercase">
            Driver Experience
          </span>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-8 leading-tight text-white">
            A frictionless journey <br />for every driver.
          </h2>
          <p className="text-zinc-400 text-lg mb-12 leading-relaxed font-medium max-w-xl">
            Empower your drivers with a premium PWA. No app store downloads required—just scan, charge, and go. Designed for speed, accessibility, and delight.
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { icon: MapPin, title: 'Smart Search', desc: 'Find available stations with real-time status.' },
              { icon: Zap, title: 'One-Tap Charge', desc: 'Start charging sessions instantly via QR.' },
              { icon: CreditCard, title: 'Easy Payments', desc: 'Secure Apple Pay and Google Pay support.' },
              { icon: Smartphone, title: 'Live Progress', desc: 'Monitor charging status from anywhere.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-zinc-500 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative perspective-1000"
        >
          <div className="relative aspect-square w-full max-w-xl mx-auto">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
            <Image
              src="/assets/ev_driver_app.png"
              alt="Scale EV Driver App Mockup"
              fill
              className="object-contain z-10 drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
              unoptimized
            />
          </div>

          {/* Floating Interaction Cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -right-8 bg-white/10 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl hidden md:block z-20 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Zap className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Charging</p>
                <p className="text-sm font-bold text-white">84% • 12 mins left</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
