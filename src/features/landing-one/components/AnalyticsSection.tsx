'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Layers, 
  Zap, 
  Leaf, 
  ShieldAlert,
  BarChart2,
  DollarSign,
  PieChart
} from 'lucide-react';

export function AnalyticsSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('year');
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  // Simulated metrics scaling based on selected period
  const metrics = {
    month: { uptime: '99.94%', utilization: '42.8%', energy: '1,240 MWh', offset: '840 Tons', rev: '$342K' },
    quarter: { uptime: '99.91%', utilization: '54.2%', energy: '4,120 MWh', offset: '2,910 Tons', rev: '$1.28M' },
    year: { uptime: '99.95%', utilization: '68.4%', energy: '18,450 MWh', offset: '14,200 Tons', rev: '$5.42M' },
  };

  const currentMetrics = metrics[selectedPeriod];

  // Bar chart simulation data points
  const chartColumns = [
    { label: 'Jan', val: 40, peak: 60, kw: '420 kW' },
    { label: 'Feb', val: 55, peak: 75, kw: '580 kW' },
    { label: 'Mar', val: 48, peak: 70, kw: '510 kW' },
    { label: 'Apr', val: 65, peak: 85, kw: '720 kW' },
    { label: 'May', val: 80, peak: 95, kw: '890 kW' },
    { label: 'Jun', val: 72, peak: 90, kw: '810 kW' },
    { label: 'Jul', val: 90, peak: 100, kw: '1.2 MW' },
    { label: 'Aug', val: 85, peak: 95, kw: '1.1 MW' },
    { label: 'Sep', val: 78, peak: 88, kw: '920 kW' },
    { label: 'Oct', val: 88, peak: 98, kw: '1.05 MW' },
    { label: 'Nov', val: 95, peak: 100, kw: '1.3 MW' },
    { label: 'Dec', val: 100, peak: 100, kw: '1.45 MW' },
  ];

  return (
    <section id="analytics" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background border-t border-border/60 dark:border-white/5">
      
      {/* Immersive radial lighting effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-primary/8 dark:bg-primary/10 blur-[180px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading tailored for CFOs and Operations Managers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-4 border border-primary/20">
            <BarChart2 className="h-3 w-3 text-primary" />
            Executive Intelligence
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-5">
            Turn Raw Power Into{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-primary bg-clip-text text-transparent block sm:inline">
              Actionable Intelligence
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Uncover the exact fiscal efficiency of your distributed charging hardware. Drill down into utilization metrics, automatically balance peak grid loading tariffs, and calculate ESG carbon offsets directly.
          </p>
        </motion.div>

        {/* Top KPI Metric overview Ribbon */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Proven Network Uptime', val: currentMetrics.uptime, icon: Activity, color: 'text-emerald-500', desc: 'SLA backed bi-directional pings' },
            { label: 'Dispensed Volume', val: currentMetrics.energy, icon: Zap, color: 'text-amber-500', desc: 'Aggregated raw continuous active import' },
            { label: 'Bay Utilization Rate', val: currentMetrics.utilization, icon: Layers, color: 'text-cyan-500', desc: 'Time occupied vs idle standby threshold' },
            { label: 'Verified Carbon Offset', val: currentMetrics.offset, icon: Leaf, color: 'text-emerald-500', desc: 'Equivalent metric ton calculations' },
            { label: 'Topline Gross Yield', val: currentMetrics.rev, icon: DollarSign, color: 'text-primary', desc: 'Accrued tariff collections cleared' },
          ].map((kpi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.08, duration: 0.6 }}
              className="rounded-xl border border-border/80 bg-card/40 dark:bg-card/20 backdrop-blur-sm p-4 relative overflow-hidden group hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-black text-foreground tracking-tight mb-1 group-hover:scale-105 transition-transform origin-left">
                {kpi.val}
              </p>
              <p className="text-[9px] text-muted-foreground/80 leading-tight">
                {kpi.desc}
              </p>

              {/* Decorative accent sliver */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Centerpiece Interactive Chart Viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-border/80 dark:border-white/10 bg-background/90 dark:bg-card/40 backdrop-blur-xl shadow-2xl p-6 relative overflow-hidden"
        >
          {/* Header controls inside the graph card */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-border/60">
            <div>
              <h4 className="text-base font-extrabold text-foreground flex items-center gap-2">
                Real-Time Load & Dispersion Overview
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h4>
              <p className="text-xs text-muted-foreground">Aggregated physical telemetry matrices overlaid with peak load warnings</p>
            </div>

            {/* Simulated Time Horizon Selection Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/40">
              {(['month', 'quarter', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`
                    px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all
                    ${selectedPeriod === period 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Large multi-layered simulated column and area graph */}
          <div className="relative h-72 sm:h-80 flex items-end gap-2 pt-10 pb-6 px-2 sm:px-6 border-b border-border/40">
            
            {/* Absolute background guidelines */}
            <div className="absolute inset-x-6 inset-y-10 flex flex-col justify-between pointer-events-none">
              {[100, 75, 50, 25, 0].map((line, i) => (
                <div key={i} className="flex items-center w-full gap-3">
                  <span className="text-[9px] font-bold font-mono text-muted-foreground/60 w-6 text-right shrink-0">{line}%</span>
                  <div className="flex-1 h-px bg-border/40 stroke-dash" />
                </div>
              ))}
            </div>

            {/* Glowing Peak Shaving Limit Overlay Simulated Line */}
            <div className="absolute top-[35%] left-14 right-6 h-px bg-amber-500/60 border-b border-dashed border-amber-500/40 pointer-events-none z-10 flex items-center justify-end">
              <span className="text-[8px] font-black uppercase text-amber-500 bg-background px-1.5 py-0.5 rounded border border-amber-500/20 translate-x-2 -translate-y-2">
                Grid Shaving Cap
              </span>
            </div>

            {/* Bars */}
            {chartColumns.map((col, idx) => {
              const isHovered = hoveredColumn === idx;
              // Scale simulation height logic based on selection toggle
              const modifier = selectedPeriod === 'month' ? 0.6 : selectedPeriod === 'quarter' ? 0.8 : 1;
              const primaryHeight = Math.floor(col.val * modifier);
              const secondaryHeight = Math.floor(col.peak * modifier);

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredColumn(idx)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  className="flex-1 h-full flex flex-col justify-end relative group cursor-pointer z-20"
                >
                  {/* Hover tooltip reveal */}
                  {isHovered && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background p-2 rounded-lg shadow-xl text-center z-50 pointer-events-none w-28 animate-fade-in">
                      <p className="text-[8px] font-extrabold uppercase text-background/80">{col.label} Dispatch</p>
                      <p className="text-xs font-black text-primary-foreground">{col.kw}</p>
                    </div>
                  )}

                  {/* Dual layered columns: Background shadow layer (Peak Capacity) */}
                  <div className="w-full flex items-end justify-center relative h-full">
                    
                    {/* Secondary faded load bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${secondaryHeight}%` }}
                      transition={{ duration: 0.5 }}
                      className="absolute w-full max-w-[28px] bg-primary/10 dark:bg-primary/15 rounded-t-md"
                    />

                    {/* Primary Solid glowing load bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${primaryHeight}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={`
                        w-full max-w-[20px] rounded-t-md relative transition-all duration-300
                        ${isHovered 
                          ? 'bg-gradient-to-t from-primary via-cyan-400 to-primary shadow-lg shadow-primary/40' 
                          : 'bg-gradient-to-t from-primary/80 to-primary'
                        }
                      `}
                    >
                      {/* Ambient cap glow */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 rounded-t-md" />
                    </motion.div>

                  </div>

                  {/* Column baseline labels */}
                  <span className={`text-[10px] font-bold text-center block mt-2 transition-colors ${isHovered ? 'text-primary font-black' : 'text-muted-foreground'}`}>
                    {col.label}
                  </span>
                </div>
              );
            })}

          </div>

          {/* Footer insights ribbon inside the component */}
          <div className="grid sm:grid-cols-3 gap-4 pt-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
              <TrendingUp className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">ROI Acceleration</p>
                <p className="text-xs font-extrabold text-foreground">+24.2% yield vs static tariff scheduling</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
              <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Peak Demand Triggers</p>
                <p className="text-xs font-extrabold text-foreground">14 automated utility step-down adjustments</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
              <PieChart className="h-4 w-4 text-cyan-500 shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Tenant Allocations</p>
                <p className="text-xs font-extrabold text-foreground">8 distinct multi-site sub-accounts clearing</p>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
