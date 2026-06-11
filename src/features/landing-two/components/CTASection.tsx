'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, MessageSquare, Zap } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  return (
    <section id="demo" className="py-28 px-6 lg:px-8 relative overflow-hidden">
      {/* Deep glowing background */}
      <div className="absolute inset-0 bg-background pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/10 via-background to-background" />
        {/* Animated glow orbs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/15 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/8 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/4"
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(100, 160, 220, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 160, 220, 0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-black tracking-[0.2em] uppercase mb-10"
        >
          <Zap className="h-3.5 w-3.5" />
          Get Started Today
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.05]"
        >
          Ready to Scale Your{' '}
          <span className="text-primary">EV Infrastructure</span>?
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Book a personalized demo and discover how Scale EV can power your charging operations with enterprise-grade tools, real-time intelligence, and seamless scalability.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link href="#contact" prefetch={false}>
            <Button
              size="lg"
              className="px-10 py-7 h-auto rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 hover:scale-[1.03] hover:shadow-primary/40 transition-all duration-300 bg-primary text-primary-foreground group"
            >
              <Calendar className="mr-2.5 h-5 w-5" />
              Schedule Demo
              <ArrowRight className="ml-2.5 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#contact" prefetch={false}>
            <Button
              size="lg"
              variant="outline"
              className="px-10 py-7 h-auto rounded-2xl border-border/60 font-bold text-lg hover:bg-accent/40 hover:border-primary/30 transition-all duration-300 backdrop-blur-sm group"
            >
              <MessageSquare className="mr-2.5 h-5 w-5" />
              Talk to Experts
            </Button>
          </Link>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground/70"
        >
          {[
            '✓ No credit card required',
            '✓ 30-minute personalized demo',
            '✓ Dedicated onboarding support',
            '✓ Cancel anytime',
          ].map((item, i) => (
            <span key={i} className="font-semibold">{item}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
