'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Building,
  Mail,
  User,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DemoCtaSection() {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [chargersCount, setChargersCount] = useState<number>(150);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companySize: '50-200',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate instant demo booking API hook
    setStep('success');
  };

  // Estimated platform pricing calculation based on charger units slider
  const estimatedBaseFee = Math.floor(chargersCount * 12.50);

  return (
    <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      
      {/* High-impact floating geometric ambient backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-primary/10 via-cyan-500/5 to-purple-500/10 blur-[180px] rounded-full -z-10" />

        {/* Ambient floating glowing orb */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] right-[10%] w-72 h-72 rounded-full bg-primary/15 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[10%] left-[10%] w-80 h-80 rounded-full bg-emerald-500/10 blur-[120px]"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Massive Card Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-border/80 dark:border-white/10 bg-card/60 dark:bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden relative"
        >
          {/* Subtle multi-colored border gradient trim */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-primary to-emerald-500" />

          <div className="grid lg:grid-cols-12 gap-0">
            
            {/* Left Column: Vision & Dynamic Slider Preview */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/60 bg-background/40">
              
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-6 border border-primary/20">
                  <Rocket className="h-3 w-3" />
                  Instant Activation
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
                  Ready to Scale{' '}
                  <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent block sm:inline">
                    Your Network?
                  </span>
                </h2>

                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
                  Deploy secure protocol brokers, auto-generate tax CDRs, and launch bespoke mobile solutions in weeks. Speak with our principal deployment architects today.
                </p>
              </div>

              {/* Dynamic Interactive Tier Pricing Estimator Widget */}
              <div className="bg-card/80 dark:bg-background/80 rounded-2xl border border-border/80 p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-primary" />
                    Network Volume Tier Estimator
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">OCPP Nodes</span>
                </div>

                {/* Range Input Slider */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Active Stalls:</span>
                    <span className="text-primary font-black text-base">{chargersCount} Units</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={chargersCount}
                    onChange={(e) => setChargersCount(Number(e.target.value))}
                    className="w-full accent-primary bg-muted rounded-lg appearance-none h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-extrabold text-muted-foreground uppercase">
                    <span>10 Base</span>
                    <span>500 Mid</span>
                    <span>1,000+ Enterprise</span>
                  </div>
                </div>

                {/* Live Output calculation */}
                <div className="pt-4 border-t border-border/40 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">
                      Estimated SaaS Broker Fee
                    </span>
                    <span className="text-2xl font-black text-foreground">
                      ${estimatedBaseFee.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-muted-foreground">/ mo</span>
                    </span>
                  </div>
                  <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2.5 py-1 rounded border border-primary/20">
                    Volume Discount Applied
                  </span>
                </div>

              </div>

              {/* Trust parameters */}
              <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No vendor lock-in
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Custom migration API
                </span>
              </div>

            </div>

            {/* Right Column: Interactive Multi-Step Demo Form Card */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
              
              <AnimatePresence mode="wait">
                {step === 'form' ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div>
                      <h4 className="text-lg font-extrabold text-foreground mb-1">
                        Secure Your Access Slot
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Direct allocation to our Tier-3 solutions engineers
                      </p>
                    </div>

                    {/* Name input */}
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <User className="h-3 w-3 text-muted-foreground" /> Full Name
                      </Label>
                      <Input
                        id="name"
                        required
                        placeholder="Marcus Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-background/60 border-border/80 h-11 rounded-xl text-sm font-medium focus-visible:ring-primary"
                      />
                    </div>

                    {/* Email input */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-muted-foreground" /> Work Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="marcus@nordicchargenet.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background/60 border-border/80 h-11 rounded-xl text-sm font-medium focus-visible:ring-primary"
                      />
                    </div>

                    {/* Company Grid Selectors */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="size" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Building className="h-3 w-3 text-muted-foreground" /> Company Size
                        </Label>
                        <select
                          id="size"
                          value={formData.companySize}
                          onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                          className="w-full bg-background/60 border border-border/80 h-11 rounded-xl text-sm font-medium px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="1-10">1-10 Employees</option>
                          <option value="11-50">11-50 Employees</option>
                          <option value="50-200">50-200 Employees</option>
                          <option value="201+">201+ Employees</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Zap className="h-3 w-3 text-muted-foreground" /> Pre-Selected Units
                        </Label>
                        <div className="h-11 rounded-xl bg-muted/60 border border-border/40 flex items-center px-3 text-xs font-black text-foreground">
                          {chargersCount} Units Linked
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all mt-4 group"
                    >
                      Confirm Platform Demo
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground mt-3">
                      By submitting, you authorize Scale EV automated sandbox validation handshakes.
                    </p>

                  </motion.form>
                ) : (
                  // Success Confirmed overlay layout
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-10 w-10 animate-bounce" />
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block mb-3">
                        Broker Token Allocated
                      </span>
                      <h4 className="text-2xl font-extrabold text-foreground mb-2">
                        Demo Requested Successfully
                      </h4>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        We have dispatched an encrypted sandbox entry vector to <strong className="text-foreground">{formData.email}</strong>. Our principal architects will call you within 2 business hours.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-border/40 max-w-xs mx-auto">
                      <Button
                        variant="outline"
                        onClick={() => setStep('form')}
                        className="w-full text-xs font-bold border-border/80"
                      >
                        Schedule Another Account
                      </Button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
