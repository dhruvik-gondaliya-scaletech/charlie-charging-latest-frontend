'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Globe, CreditCard, Activity, CheckCircle2 } from 'lucide-react';

interface Partner {
  name: string;
  category: 'hardware' | 'roaming' | 'payments' | 'utilities';
  description: string;
  status: string;
}

export function PartnersSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'hardware' | 'roaming' | 'payments' | 'utilities'>('all');

  const categories = [
    { id: 'all', label: 'All Integrations' },
    { id: 'hardware', label: 'OCPP Hardware' },
    { id: 'roaming', label: 'Roaming Networks' },
    { id: 'payments', label: 'Payment Gateways' },
    { id: 'utilities', label: 'Utility APIs' },
  ];

  const partners: Partner[] = [
    { name: 'ABB Heavy Chargers', category: 'hardware', description: 'Fully certified CCS & CHAdeMO multi-standard cabinets.', status: 'Native Integration' },
    { name: 'Alfen Smart Cabinets', category: 'hardware', description: 'Certified dual-socket public and residential AC chargers.', status: 'Native Integration' },
    { name: 'Tritium Fast Chargers', category: 'hardware', description: 'Liquid-cooled direct-current ultra-fast chargers.', status: 'Tested & Certified' },
    { name: 'Hubject Roaming', category: 'roaming', description: 'OCPI-based peering with the largest European roaming hub.', status: 'OCPI Gateway' },
    { name: 'Gireve Network', category: 'roaming', description: 'Direct clearing and roaming connections across 30+ operators.', status: 'OCPI Gateway' },
    { name: 'Stripe Payments', category: 'payments', description: 'Global credit card processing, Apple Pay, and Google Pay billing.', status: 'Native Link' },
    { name: 'Adyen Checkout', category: 'payments', description: 'Enterprise merchant account support for multi-region setups.', status: 'Enterprise Add-on' },
    { name: 'Nord Pool Energy API', category: 'utilities', description: 'Dynamic time-of-use spot pricing sync for automated tariffs.', status: 'Live Sync' },
    { name: 'Dynamic Grid Adapters', category: 'utilities', description: 'Modbus and OCPP load profiles for substation safety.', status: 'Hardware Link' },
  ];

  const filteredPartners = activeTab === 'all' ? partners : partners.filter(p => p.category === activeTab);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col space-y-4">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">
            Ecosystem Integrations
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Built for Complete Compatibility
          </h2>
          <p className="text-muted-foreground text-base font-medium leading-relaxed">
            Our CSMS connects with your existing hardware fleet, billing provider, roaming network, and local grid operator out-of-the-box.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                activeTab === cat.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-muted/50 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Partners Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredPartners.map((partner) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={partner.name}
                className="group border border-border/60 bg-card rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-primary/20 hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black tracking-tight text-foreground">
                      {partner.name}
                    </span>
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    {partner.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                    {partner.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {partner.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
