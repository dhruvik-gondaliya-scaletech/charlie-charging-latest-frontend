'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FinalCTASection() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Quick regex email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API registration delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <section id="cta-section" className="relative py-32 px-6 lg:px-8 bg-muted/30 text-foreground overflow-hidden transition-colors duration-300">
      {/* 
        Intense energy glows surrounding the centered card 
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] bg-primary/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Animated Card boundary */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2.5rem] bg-card border border-border p-8 sm:p-12 lg:p-16 backdrop-blur-xl shadow-2xl dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 dark:border-white/10 overflow-hidden text-center"
        >
          {/* Inner radial gradient highlights */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)/0.05,transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)/0.1,transparent_60%)] pointer-events-none" />

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                {/* Visual anchor icon */}
                <div className="inline-flex w-12 h-12 rounded-full bg-primary/10 border border-primary/20 items-center justify-center text-primary mb-6">
                  <Mail className="h-5 w-5" />
                </div>

                {/* Typography */}
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                  Ready to Launch Your Network?
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mb-10 leading-relaxed">
                  Join the charging operators switching to Scale EV. Submit your email to receive our custom branding options and book a live CSMS demo.
                </p>

                {/* Form layout */}
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <div className="flex-1 relative">
                      <Input
                        type="email"
                        placeholder="Enter your work email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        className="bg-background border-border text-foreground placeholder-muted-foreground dark:bg-muted/80 dark:border-white/10 dark:text-white dark:placeholder-muted-foreground h-14 px-5 rounded-xl focus-visible:ring-primary/50 transition-all text-sm w-full"
                        disabled={isSubmitting}
                      />
                      {error && (
                        <p className="text-destructive text-xs text-left mt-1.5 ml-1 absolute">
                          {error}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/95 text-primary-foreground font-black text-sm h-14 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 border-0 shrink-0 mt-6 sm:mt-0 animate-glow"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          Book Demo
                          <ArrowRight className="h-4 w-4 text-primary-foreground" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Trust signal taglines */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 pt-8 border-t border-border dark:border-white/5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                    <span>No credit card required</span>
                  </div>
                  <span className="hidden sm:inline text-border dark:text-white/10">•</span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <span>Launch-ready in 7 days</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="py-6"
              >
                {/* Success visual icon */}
                <div className="inline-flex w-16 h-16 rounded-full bg-success/10 border border-success/20 items-center justify-center text-success mb-6 animate-bounce">
                  <CheckCircle className="h-8 w-8" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
                  Demo Request Scheduled!
                </h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
                  We have sent details to <strong className="text-success">{email}</strong>. Our partnerships team will connect with you within 24 business hours.
                </p>

                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="bg-muted hover:bg-muted/80 text-foreground dark:bg-white/5 dark:hover:bg-white/10 dark:text-white font-bold px-6 py-2.5 rounded-xl border border-border dark:border-white/10 transition-all text-xs"
                >
                  Request another demo
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      </div>
    </section>
  );
}
