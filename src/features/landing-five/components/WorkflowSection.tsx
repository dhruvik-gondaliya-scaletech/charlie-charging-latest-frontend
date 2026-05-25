'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, ChevronRight, Square, Terminal, Code } from 'lucide-react';
import { workflowSteps } from '../data/landingFiveData';

export function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="workflow" className="py-24 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[12px] font-extrabold text-blue-600 tracking-widest uppercase bg-blue-50 px-3.5 py-1.5 rounded-full">
            How it works
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-6 tracking-tight">
            Deploy in three simple steps
          </h2>
          <p className="text-gray-500 font-medium mt-4 text-base md:text-lg">
            ScaleEV is designed to reduce complexity. Go from unboxing new hardware to taking payments in minutes.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Steps Column */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.step}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                  activeStep === idx
                    ? 'bg-white border-blue-500/20 shadow-xl shadow-blue-500/5'
                    : 'bg-white/40 border-gray-200/50 hover:bg-white hover:border-gray-200 shadow-sm'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    activeStep === idx
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.step}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-bold transition-colors ${activeStep === idx ? 'text-blue-600' : 'text-gray-800'}`}>
                      {step.title}
                    </h3>
                    <span className="text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md tracking-wider">
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Preview Widget Column */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-gray-900 rounded-2xl border border-gray-800/80 shadow-2xl p-6 relative aspect-[16/10] flex flex-col justify-between overflow-hidden">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div className="flex space-x-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1 rounded-md border border-gray-800">
                  <Terminal className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {activeStep === 0 && 'ocpp_connection.sh'}
                    {activeStep === 1 && 'tariff_config.json'}
                    {activeStep === 2 && 'portal_preview.tsx'}
                  </span>
                </div>
                <div className="w-6 h-6" /> {/* Spacer */}
              </div>

              {/* Console/Widget Content */}
              <div className="flex-1 py-6 font-mono text-xs overflow-auto leading-relaxed relative">
                <AnimatePresence mode="wait">
                  {activeStep === 0 && (
                    <motion.div
                      key="connect"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-300 space-y-4"
                    >
                      <p className="text-gray-500"># Setting up charging station OCPP endpoint...</p>
                      <p>
                        <span className="text-blue-400">ocpp-server</span> --host <span className="text-green-400">wss://api.scaleev.com/ocpp</span>
                      </p>
                      <p className="text-gray-500"># Listening for incoming connections on websocket port 443...</p>
                      <p className="text-emerald-400 font-bold">✔ [Station-0422] Connection accepted successfully via OCPP 1.6-J.</p>
                      <p className="text-gray-400">Received BootNotification. Sending registration response...</p>
                      <p className="text-emerald-400 font-bold">✔ Registration status: Accepted. Heartbeat set to 60s.</p>
                    </motion.div>
                  )}

                  {activeStep === 1 && (
                    <motion.div
                      key="configure"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-yellow-400 space-y-2"
                    >
                      <p className="text-gray-500">// Configured Location: Downtown Hub (ID: loc_4021)</p>
                      <p className="text-gray-300">
                        {`{`}
                        <br />
                        &nbsp;&nbsp;<span className="text-blue-400">"currency"</span>: <span className="text-green-400">"USD"</span>,
                        <br />
                        &nbsp;&nbsp;<span className="text-blue-400">"basePrice"</span>: <span className="text-indigo-400">0.25</span>, <span className="text-gray-500">// per kWh</span>
                        <br />
                        &nbsp;&nbsp;<span className="text-blue-400">"idlePenalty"</span>: <span className="text-indigo-400">0.10</span>, <span className="text-gray-500">// per minute after 15m grace</span>
                        <br />
                        &nbsp;&nbsp;<span className="text-blue-400">"discountTiers"</span>: [
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{`{ `}<span className="text-blue-400">"group"</span>: <span className="text-green-400">"fleet_members"</span>, <span className="text-blue-400">"rate"</span>: <span className="text-indigo-400">0.18</span>{` }`}
                        <br />
                        &nbsp;&nbsp;]
                        <br />
                        {`}`}
                      </p>
                      <p className="text-emerald-400 font-bold mt-4">✔ Pricing structure verified. Applied to 8 connectors.</p>
                    </motion.div>
                  )}

                  {activeStep === 2 && (
                    <motion.div
                      key="launch"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-300 space-y-4"
                    >
                      <p className="text-gray-500">// White-label mobile app custom theme variables</p>
                      <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400">Primary Brand Color</span>
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded bg-blue-600" />
                            <span className="font-mono text-[10px] text-gray-300">#2563EB</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400">App Name</span>
                          <span className="font-mono text-xs font-bold text-white">ScaleEV Charge</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400">Custom Domain</span>
                          <span className="font-mono text-[10px] text-emerald-400 underline">charge.scaleev.com</span>
                        </div>
                      </div>
                      <p className="text-emerald-400 font-bold">✔ Mobile application bundle generated for App Store & Google Play.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Indicator */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-[11px] text-gray-500">
                <span>System status: Online</span>
                <span className="font-bold text-blue-500 flex items-center gap-1">
                  Step {activeStep + 1} of 3 <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
