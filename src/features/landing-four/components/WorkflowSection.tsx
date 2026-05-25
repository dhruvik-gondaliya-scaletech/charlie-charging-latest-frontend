'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon, 
  CreditCard, 
  Smartphone, 
  Check, 
  Sparkles, 
  Play,
  RotateCcw,
  DollarSign,
  TrendingUp,
  Paintbrush
} from 'lucide-react';

interface TabItem {
  id: number;
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  badge: string;
}

export function WorkflowSection() {
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Interactive states for Tab 0: Terminal
  const [logs, setLogs] = useState<string[]>([]);
  const [terminalKey, setTerminalKey] = useState<number>(0);

  // Interactive states for Tab 1: Tariff Configurator
  const [basePrice, setBasePrice] = useState<number>(0.39);
  const [idleFee, setIdleFee] = useState<number>(0.15);
  const [hasPeakPricing, setHasPeakPricing] = useState<boolean>(true);

  // Interactive states for Tab 2: Mobile customizer
  const [brandName, setBrandName] = useState<string>('ChargeVolt');
  const [brandColor, setBrandColor] = useState<string>('#3b82f6'); // blue-500 default

  // Tab definitions
  const tabs: TabItem[] = [
    {
      id: 0,
      icon: <TerminalIcon className="w-4 h-4" />,
      label: 'Connect',
      title: 'Connect Chargers via OCPP',
      description: 'Point your charger hardware to our secure WebSocket endpoint. Works with OCPP 1.6-J and OCPP 2.0.1 protocols with zero configuration needed. Watch the live handshake complete in seconds.',
      badge: 'WebSocket Setup'
    },
    {
      id: 1,
      icon: <CreditCard className="w-4 h-4" />,
      label: 'Configure',
      title: 'Configure Sites & Tariffs',
      description: 'Define pricing structures, split utility billing, and configure idle fees to prevent station blocking. Customize the live pricing model below to see estimated monthly revenue.',
      badge: 'Site Management'
    },
    {
      id: 2,
      icon: <Smartphone className="w-4 h-4" />,
      label: 'Brand & Launch',
      title: 'Deploy White-Label Apps',
      description: 'Provide drivers with custom iOS, Android, and web portals branded with your exact styling. Customize the app brand name and colors to preview your white-label launch.',
      badge: 'Brand Launch'
    }
  ];

  // Terminal connection log simulator
  useEffect(() => {
    if (activeTab !== 0) return;
    
    setLogs([]);
    const logPool = [
      'Establishing WebSocket connection to wss://csms.scale-ev.com/ocpp/STATION-701...',
      'Connection status: Connected (101 Switching Protocols)',
      '>> [OCPP 2.0.1] Sending BootNotificationRequest { model: "Terra 54", vendor: "ABB" }',
      '<< [OCPP 2.0.1] Received BootNotificationResponse { status: "Accepted", interval: 60 }',
      'System: Connection registered under Tenant ID: tx_9921_charlie',
      '>> [OCPP 2.0.1] Sending StatusNotification { connectorId: 1, status: "Available" }',
      'System: Connector 1 status updated to AVAILABLE in real-time database.',
      '>> [OCPP 2.0.1] Sending StatusNotification { connectorId: 2, status: "Available" }',
      'Heartbeat: Active WebSocket stream is live. Listening for driver authorization...'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logPool.length) {
        const nextLog = logPool[currentLogIndex];
        setLogs(prev => [...prev, nextLog]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [activeTab, terminalKey]);

  // Calculations for Tab 1
  const monthlyTransactions = 420; // average sessions per month for a typical station cluster
  const calculatedRevenue = (monthlyTransactions * 35 * basePrice) + (monthlyTransactions * 15 * idleFee * (hasPeakPricing ? 1.25 : 1));

  return (
    <section id="workflow" className="py-28 bg-background relative overflow-hidden border-b border-border/40">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col space-y-4">
          <span className="text-[11px] font-black tracking-[0.2em] text-primary uppercase">
            GETTING STARTED
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Launch Your EV Charging Software in Just 3 Steps
          </h2>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            ScaleEV makes it easy to deploy, configure, and brand your charging network. Follow our simple onboarding wizard to connect your first charger.
          </p>
        </div>

        {/* Tab Buttons bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2.5 px-6 py-3.5 rounded-full border transition-all duration-300 font-bold text-xs ${
                activeTab === tab.id
                  ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.03]'
                  : 'bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left Description Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {tabs[activeTab].badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {tabs[activeTab].title}
            </h3>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
              {tabs[activeTab].description}
            </p>
            
            <ul className="space-y-3 pt-2">
              <li className="flex items-center space-x-3 text-xs font-semibold text-foreground/80">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>OCPP 1.6-J & OCPP 2.0.1 compatibility</span>
              </li>
              <li className="flex items-center space-x-3 text-xs font-semibold text-foreground/80">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Immediate configuration and scaling ready</span>
              </li>
            </ul>
          </div>

          {/* Right Interactive Simulator Column */}
          <div className="lg:col-span-7 flex justify-center items-center w-full min-h-[380px]">
            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <motion.div
                  key="tab0"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-full max-w-lg bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl p-5 font-mono text-xs text-zinc-300 relative overflow-hidden"
                >
                  {/* Window Bar */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 select-none">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/80" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Terminal Connection Stream</span>
                    <button 
                      onClick={() => setTerminalKey(prev => prev + 1)}
                      className="p-1 hover:bg-zinc-800 rounded transition-colors text-zinc-500 hover:text-zinc-300"
                      title="Restart handshake stream"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Stream logs */}
                  <div className="h-60 overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pr-1">
                    {logs.map((log, index) => {
                      if (!log) return null;
                      let colorClass = 'text-zinc-400';
                      if (log.startsWith('>>')) colorClass = 'text-blue-400 font-bold';
                      else if (log.startsWith('<<')) colorClass = 'text-emerald-400 font-bold';
                      else if (log.startsWith('System:')) colorClass = 'text-purple-400';
                      else if (log.startsWith('Heartbeat:')) colorClass = 'text-amber-400 font-bold';
                      
                      return (
                        <div key={index} className="leading-relaxed flex items-start space-x-1">
                          <span className="text-zinc-600 select-none">&gt;</span>
                          <span className={colorClass}>{log}</span>
                        </div>
                      );
                    })}
                    {logs.length < 9 && (
                      <div className="flex items-center space-x-1 text-zinc-500 animate-pulse">
                        <span>&gt;</span>
                        <span className="w-2.5 h-4 bg-zinc-500" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div
                  key="tab1"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-full max-w-lg bg-card rounded-2xl border border-border p-6 shadow-xl flex flex-col space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Tariff Model Configurator</h4>
                      <p className="text-[11px] text-muted-foreground">Adjust parameters to simulate charging yield</p>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 text-primary rounded-full p-2.5">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Pricing Inputs */}
                  <div className="space-y-4">
                    {/* Energy rate slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-muted-foreground">Energy Cost / kWh</span>
                        <span className="text-foreground">${basePrice.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.20" 
                        max="0.99" 
                        step="0.01" 
                        value={basePrice}
                        onChange={(e) => setBasePrice(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary" 
                      />
                    </div>

                    {/* Idle fee slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-muted-foreground">Idle Occupancy Fee / Min</span>
                        <span className="text-foreground">${idleFee.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.00" 
                        max="0.50" 
                        step="0.05" 
                        value={idleFee}
                        onChange={(e) => setIdleFee(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary" 
                      />
                    </div>

                    {/* Peak hour modifier checkbox */}
                    <div className="flex items-center space-x-3 pt-2">
                      <input 
                        type="checkbox" 
                        id="peakPricing" 
                        checked={hasPeakPricing}
                        onChange={(e) => setHasPeakPricing(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/40 cursor-pointer" 
                      />
                      <label htmlFor="peakPricing" className="text-xs font-bold text-foreground cursor-pointer select-none">
                        Apply +25% Peak Hours Tariff multiplier
                      </label>
                    </div>
                  </div>

                  {/* Profit output */}
                  <div className="bg-muted/40 border border-border/60 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Estimated Station Revenue</p>
                      <p className="text-2xl font-black text-foreground pt-0.5">${calculatedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-xs font-bold text-muted-foreground">/mo</span></p>
                    </div>
                    <div className="flex flex-col items-end text-right">
                      <span className="text-[9px] font-bold text-emerald-500 uppercase flex items-center bg-emerald-500/10 px-2 py-0.5 rounded">
                        <DollarSign className="w-2.5 h-2.5" /> High Margin
                      </span>
                      <span className="text-[9px] text-muted-foreground pt-1">Based on 420 sessions</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 2 && (
                <motion.div
                  key="tab2"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-full max-w-md flex flex-col md:flex-row gap-6 items-stretch justify-center"
                >
                  {/* Design Controller Widget */}
                  <div className="flex-1 bg-card border border-border p-5 rounded-2xl shadow-md flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-primary">
                        <Paintbrush className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-wider">App Theme Editor</h4>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">Instantly skin the customer interface</p>
                    </div>

                    <div className="space-y-3">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">App Logo Text</label>
                        <input 
                          type="text" 
                          value={brandName}
                          maxLength={16}
                          onChange={(e) => setBrandName(e.target.value)}
                          className="w-full bg-muted border border-border/80 rounded-lg px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      {/* Color dots picker */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground block">Primary Brand Accent</label>
                        <div className="flex space-x-2 pt-1">
                          {[
                            { color: '#3b82f6', label: 'Blue' }, // blue-500
                            { color: '#10b981', label: 'Green' }, // emerald-500
                            { color: '#8b5cf6', label: 'Purple' }, // violet-500
                            { color: '#f59e0b', label: 'Amber' }, // amber-500
                            { color: '#ef4444', label: 'Red' }, // red-500
                          ].map((item) => (
                            <button
                              key={item.color}
                              onClick={() => setBrandColor(item.color)}
                              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                brandColor === item.color 
                                  ? 'border-foreground scale-110' 
                                  : 'border-transparent hover:scale-105'
                              }`}
                              style={{ backgroundColor: item.color }}
                              title={item.label}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-[9.5px] text-muted-foreground leading-relaxed">
                      Changes deploy immediately to Apple App Store &amp; Google Play Store upon save.
                    </div>
                  </div>

                  {/* Simulated Mobile Phone Viewport */}
                  <div className="w-56 h-[320px] rounded-[32px] border-8 border-foreground/90 bg-zinc-950 p-2 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none shrink-0 self-center">
                    {/* Speaker notch */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-3 bg-foreground rounded-full" />
                    
                    {/* Inside Phone Screen */}
                    <div className="w-full h-full bg-zinc-900 rounded-[22px] overflow-hidden flex flex-col justify-between p-3 pt-4">
                      {/* Top Bar Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                        <span className="text-[9px] font-black text-white">{brandName}</span>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brandColor }} />
                      </div>

                      {/* Map Simulation */}
                      <div className="flex-1 bg-zinc-800/80 rounded-xl my-2 flex flex-col justify-center items-center p-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:10px_10px]" />
                        
                        {/* Map Pins */}
                        <div 
                          className="absolute w-4 h-4 rounded-full flex items-center justify-center text-[7px] text-white font-bold animate-bounce shadow-lg"
                          style={{ backgroundColor: brandColor, top: '35%', left: '30%' }}
                        >
                          EV
                        </div>
                        <div 
                          className="absolute w-3.5 h-3.5 rounded-full flex items-center justify-center text-[5px] text-white opacity-85 shadow"
                          style={{ backgroundColor: brandColor, bottom: '25%', right: '25%' }}
                        >
                          EV
                        </div>
                        
                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider relative">Interactive map</span>
                      </div>

                      {/* Bottom Button */}
                      <button 
                        className="w-full text-[9px] font-black text-white py-2 rounded-lg text-center transition-colors shadow-sm"
                        style={{ backgroundColor: brandColor }}
                      >
                        Start Charging
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
