'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import BookADemo from './BookADemo';

export function CTASection() {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay check:", err);
      });
    }
  }, []);

  return (
    <section id="cta" className="py-24 bg-background relative overflow-hidden">
      {/* Background Video & Legibility Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src="https://d39uw1u176mxxs.cloudfront.net/branding-videos/scaleev-brnading2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-75 dark:opacity-40 brightness-[1.0] dark:brightness-[1.0]"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2.5rem] bg-black/50 backdrop-blur-xl border border-white/10 text-white overflow-hidden px-8 py-16 md:px-16 md:py-20 shadow-2xl"
        >
          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
            
            {/* Promo badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                Ready to Deploy
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Ready to Build Your EV Charging Network?
            </h2>

            {/* Description */}
            <p className="text-white/80 text-base font-semibold leading-relaxed">
              Join companies worldwide that trust ScaleEV to power their charging infrastructure. Book a demo to speak with our experts.
            </p>

            {/* Action buttons */}
            <div className="flex items-center justify-center w-full pt-4">
              <BookADemo>
                <button className="w-full sm:w-auto bg-primary text-primary-foreground hover:scale-[1.03] active:scale-[0.98] transition-all rounded-full px-8 py-6 text-base font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Book a Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </BookADemo>
            </div>

            {/* Value indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-6 text-xs font-bold text-white/70 uppercase tracking-widest">
              <div>✓ OCPP 1.6J/2.0.1 Compliant</div>
              <div>✓ White-Label Platform</div>
              <div>✓ Enterprise Scale Ready</div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
