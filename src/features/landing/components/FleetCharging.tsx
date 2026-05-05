'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function FleetCharging() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-muted/5">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Fleet Management</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">EV Fleet Charging And Employee Reimbursement</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Manage your corporate fleet with ease. Scale EV provides comprehensive tools for fleet managers to track energy consumption, manage driver access, and automate employee reimbursement for home charging.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="bg-card px-4 py-2 rounded-lg border border-border/50 text-sm font-bold shadow-sm">OCPP 1.6 & 2.0.1</div>
            <div className="bg-card px-4 py-2 rounded-lg border border-border/50 text-sm font-bold shadow-sm">Home Charging Sync</div>
            <div className="bg-card px-4 py-2 rounded-lg border border-border/50 text-sm font-bold shadow-sm">Fleet Dashboards</div>
          </div>
          <Button variant="outline" className="px-8 py-6 h-auto rounded-xl font-bold text-base border-primary/20 text-primary hover:bg-primary/5">
            View Fleet Solutions
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/50"
        >
          <Image
            src="https://images.unsplash.com/photo-1614030424754-24d62bf47530?q=80&w=2070&auto=format&fit=crop"
            alt="EV Fleet Charging"
            fill
            className="object-cover"
            unoptimized
          />
        </motion.div>
      </div>
    </section>
  );
}
