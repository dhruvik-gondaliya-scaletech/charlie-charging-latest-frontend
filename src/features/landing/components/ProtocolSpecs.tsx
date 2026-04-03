'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Terminal } from 'lucide-react';

export function ProtocolSpecs() {
  return (
    <section id="protocols" className="py-24 px-8 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-8 leading-tight">
            Engineering-first <br />architecture.
          </h2>
          <p className="text-neutral-400 text-lg mb-12 leading-relaxed font-medium">
            We don&apos;t just support protocols; we define how they operate at scale. Full compliance with OCPP 2.0.1 ensures future-proofing your entire hardware fleet.
          </p>
          <ul className="space-y-6">
            {[
              { title: 'OCPP 2.0.1 & 1.6J Full Stack', desc: 'Industry-leading message queue handling for high-density networks.' },
              { title: 'OCPI 2.2.1 Native', desc: 'Automated settlement and clearing between roaming partners.' },
              { title: 'Developer SDK & API', desc: 'RESTful architecture with GraphQL support for complex data queries.' }
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-neutral-500">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="relative"
        >
          <div className="absolute -inset-10 bg-white/5 blur-3xl rounded-full"></div>
          <div className="relative bg-neutral-900 rounded-2xl border border-neutral-800 p-8 font-mono text-sm shadow-2xl overflow-hidden">
            <div className="flex gap-1.5 mb-8">
              <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
            </div>
            <div className="space-y-3">
              <p className="text-neutral-500">{'// Initialize Charging Station Connect'}</p>
              <p className="text-emerald-400">POST <span className="text-neutral-300">/api/v1/stations/boot</span></p>
              <p className="text-neutral-300">{'{'}</p>
              <p className="pl-4 text-neutral-300">&quot;stationId&quot;: &quot;EV-LON-042&quot;,</p>
              <p className="pl-4 text-neutral-300">&quot;protocol&quot;: &quot;OCPP_2_0_1&quot;,</p>
              <p className="pl-4 text-neutral-300">&quot;status&quot;: <span className="text-yellow-500">&quot;Available&quot;</span>,</p>
              <p className="pl-4 text-neutral-300">&quot;firmware&quot;: &quot;v3.1.2-stable&quot;</p>
              <p className="text-neutral-300">{'}'}</p>
              <p className="text-neutral-500 pt-6">{'// Listen for Webhooks'}</p>
              <p className="text-blue-400">await <span className="text-neutral-300">scale.on(</span><span className="text-yellow-500">&apos;session_start&apos;</span><span className="text-neutral-300">, (data) =&gt; {'{'}</span></p>
              <p className="pl-4 text-neutral-300">notifyNetworkManager(data.id);</p>
              <p className="text-neutral-300">{'}'});</p>
            </div>
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-10 -right-4 bg-white text-black p-6 rounded-xl shadow-2xl border border-neutral-200 hidden md:block"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-100 rounded-lg">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">API Health</p>
                <p className="text-sm font-bold">99.99% Uptime</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
