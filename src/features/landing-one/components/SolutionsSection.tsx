'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Activity, 
  FileText, 
  Truck, 
  BarChart3, 
  Bell, 
  Sliders, 
  DownloadCloud, 
  Map, 
  CreditCard, 
  Users,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const features = [
  { id: 'ocpp', icon: Cpu, label: 'OCPP Communication', desc: 'Native bi-directional OCPP 1.6J and 2.0.1 message framing with real-time websocket heartbeat parsing.', tag: 'Core Engine' },
  { id: 'monitoring', icon: Activity, label: 'Live Monitoring', desc: 'Sub-second state tracking for connectors, meter values, voltage drops, and active temperature triggers.', tag: 'Telemetry' },
  { id: 'transactions', icon: FileText, label: 'Transaction Routing', desc: 'High-throughput CDR generation with dynamic authorization caching and offline transaction queueing.', tag: 'Billing' },
  { id: 'fleet', icon: Truck, label: 'Fleet Operations', desc: 'Pre-scheduled depot charging loads, RFID access white-listing, and automated route priority handshakes.', tag: 'Enterprise' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics & Reports', desc: 'Customizable export matrices for ESG reporting, utility peak shaving, and sub-site ROI tracking.', tag: 'Insights' },
  { id: 'alerts', icon: Bell, label: 'Smart Alerts', desc: 'Custom threshold webhooks for ground faults, unresponsive stations, and irregular power spikes.', tag: 'Automation' },
  { id: 'remote', icon: Sliders, label: 'Remote Control', desc: 'Instant Start/Stop overrides, hard/soft resets, and raw diagnostic configuration key injections.', tag: 'Diagnostics' },
  { id: 'firmware', icon: DownloadCloud, label: 'Firmware Staging', desc: 'Scheduled OTA package distributions with cryptographic validation and fallback backup integrity checks.', tag: 'Maintenance' },
  { id: 'locations', icon: Map, label: 'Multi-Location Control', desc: 'Hierarchical network tree management spanning master operators, sub-tenants, and localized physical clusters.', tag: 'Scale' },
  { id: 'payments', icon: CreditCard, label: 'Payment Integrations', desc: 'Plug-and-play settlement bridges supporting Stripe, Adyen, dynamic QR roaming grids, and corporate billing.', tag: 'Fintech' },
  { id: 'roles', icon: Users, label: 'Role-Based Access', desc: 'Granular permissions tailoring dashboard visibility for site technicians, finance auditors, and support reps.', tag: 'Security' },
];

export function SolutionsSection() {
  const [activeTab, setActiveTab] = useState('ocpp');

  const selectedFeature = features.find(f => f.id === activeTab) || features[0];

  return (
    <section id="solutions" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      
      {/* Immersive background layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glow behind the dashboard centerpiece */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/8 dark:bg-primary/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 blur-[160px] rounded-full" />

        {/* Floating animated ambient connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path d="M100,200 L400,200 L500,400 L900,400" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M1200,800 L800,800 L700,500 L300,500" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="6 6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-4 border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Futuristic Command Center
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
            One Intelligent Platform.{' '}
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent block sm:inline">
              Total Operational Control.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Eliminate operational blind spots. Scale EV unifies telemetry, payment rails, and remote station primitives inside an advanced enterprise viewport.
          </p>
        </motion.div>

        {/* Centerpiece: Massive Floating Dashboard Mockup */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center Mockup Pane */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 relative"
          >
            {/* Soft decorative bounding box glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-cyan-500/10 to-primary/20 rounded-3xl blur-xl opacity-60 -z-10" />

            {/* Main Outer Glass Frame */}
            <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-background/90 dark:bg-card/60 backdrop-blur-3xl shadow-2xl p-6 relative overflow-hidden">
              
              {/* Dashboard Internal Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-border/60 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                      Master Command Viewport
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">OCPP Direct</span>
                    </h4>
                    <p className="text-[10px] text-muted-foreground">Connected Node Tree: Root cluster / Active Regions (12)</p>
                  </div>
                </div>

                {/* Simulated Telemetry Filters */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Filter:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black tracking-wider uppercase">
                    {selectedFeature.tag}
                  </span>
                </div>
              </div>

              {/* Dynamic Interactivity Showcase based on Selected Feature */}
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl p-4 bg-muted/40 dark:bg-background/40 border border-border/40">
                  <p className="text-[9px] font-extrabold tracking-widest text-muted-foreground uppercase mb-1">Focus Module</p>
                  <p className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <selectedFeature.icon className="h-4 w-4 shrink-0" />
                    {selectedFeature.label}
                  </p>
                </div>
                <div className="rounded-xl p-4 bg-muted/40 dark:bg-background/40 border border-border/40">
                  <p className="text-[9px] font-extrabold tracking-widest text-muted-foreground uppercase mb-1">Stream Status</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Synchronized
                  </p>
                </div>
                <div className="rounded-xl p-4 bg-muted/40 dark:bg-background/40 border border-border/40">
                  <p className="text-[9px] font-extrabold tracking-widest text-muted-foreground uppercase mb-1">API Handshake</p>
                  <p className="text-sm font-bold text-foreground flex items-center gap-1">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin duration-3000" /> Secure TLS
                  </p>
                </div>
              </div>

              {/* Dynamic Feature Details Pane inside the Mockup */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFeature.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border border-primary/20 dark:border-primary/30 bg-primary/[0.03] dark:bg-primary/[0.05] p-5 mb-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <selectedFeature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold tracking-widest uppercase text-primary px-2 py-0.5 rounded bg-primary/10 inline-block mb-1.5">
                        Capability Payload
                      </span>
                      <h5 className="text-base font-extrabold text-foreground mb-1">{selectedFeature.label}</h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">{selectedFeature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Layered Embedded Mockup View: Real-time Telemetry Grid Simulation */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-3">
                  Live OCPP Hardware Output Feed
                </p>
                <div className="rounded-xl border border-border/60 overflow-hidden bg-background">
                  <div className="grid grid-cols-4 bg-muted/60 p-2.5 text-[9px] font-extrabold tracking-wider uppercase text-muted-foreground border-b border-border/60">
                    <span>Connector Node</span>
                    <span>State</span>
                    <span>Meter Load</span>
                    <span className="text-right">Action</span>
                  </div>
                  <div className="divide-y divide-border/40 text-xs">
                    {[
                      { id: 'CS-ALPHA-01', state: 'Charging', kw: '142.4 kW', pulse: true },
                      { id: 'CS-ALPHA-02', state: 'Idle', kw: '0.0 kW', pulse: false },
                      { id: 'CS-BRAVO-01', state: 'Finishing', kw: '8.2 kW', pulse: true },
                      { id: 'CS-DELTA-04', state: 'SuspendedEV', kw: '0.0 kW', pulse: false },
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-4 items-center p-2.5 hover:bg-muted/20 transition-colors">
                        <span className="font-bold text-foreground">{row.id}</span>
                        <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${row.pulse ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
                          {row.state}
                        </span>
                        <span className="text-muted-foreground font-mono text-[11px]">{row.kw}</span>
                        <span className="text-right">
                          <span className="text-[9px] font-bold text-primary cursor-pointer hover:underline">Inspect</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Embedded Map Sub-layer overlay */}
              <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border/80 px-3 py-1.5 rounded-lg shadow-md z-10">
                <Zap className="h-3 w-3 text-amber-500" />
                <span className="text-[9px] font-extrabold text-foreground">Peak routing enabled</span>
              </div>

            </div>

          </motion.div>

          {/* Right Controls / Interactive List Tab Selection */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-2"
          >
            <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-3 px-1">
              Select Framework Capability
            </p>

            <div className="custom-scrollbar-dark max-h-[580px] overflow-y-auto space-y-2 pr-1">
              {features.map((f) => {
                const isActive = activeTab === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveTab(f.id)}
                    className={`
                      w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group
                      ${isActive 
                        ? 'bg-primary/10 border-primary/40 dark:border-primary/50 text-foreground shadow-sm' 
                        : 'bg-card/40 hover:bg-card/80 border-border/60 text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:text-primary'}`}>
                        <f.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold transition-colors ${isActive ? 'text-primary dark:text-primary' : 'text-foreground'}`}>
                          {f.label}
                        </p>
                        <p className="text-[9px] text-muted-foreground font-semibold">
                          {f.tag}
                        </p>
                      </div>
                    </div>

                    <div className={`w-1.5 h-1.5 rounded-full transition-transform duration-300 ${isActive ? 'bg-primary scale-125' : 'bg-transparent'}`} />
                  </button>
                );
              })}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
