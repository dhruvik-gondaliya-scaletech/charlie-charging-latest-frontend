'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Terminal } from 'lucide-react';

export function ProtocolSpecs() {
  return (
    <section id="protocols" className="py-24 px-8 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-8 leading-tight text-zinc-900 dark:text-zinc-100">
            Engineering-first <br />architecture.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-12 leading-relaxed font-medium">
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
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{item.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500">{item.desc}</p>
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
          <div className="absolute -inset-10 bg-primary/5 blur-3xl rounded-full"></div>
          <div className="relative bg-zinc-900 dark:bg-black rounded-2xl border border-zinc-800 p-8 font-mono text-sm shadow-2xl overflow-hidden text-zinc-100">
            <div className="flex gap-1.5 mb-8">
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
            </div>
            <div className="space-y-3">
              <p className="text-zinc-500">{'// Initialize Charging Station Connect'}</p>
              <p className="text-emerald-400">POST <span className="text-zinc-300">/api/v1/stations/boot</span></p>
              <p className="text-zinc-300">{'{'}</p>
              <p className="pl-4 text-zinc-300">&quot;stationId&quot;: &quot;EV-LON-042&quot;,</p>
              <p className="pl-4 text-zinc-300">&quot;protocol&quot;: &quot;OCPP_2_0_1&quot;,</p>
              <p className="pl-4 text-zinc-300">&quot;status&quot;: <span className="text-yellow-500">&quot;Available&quot;</span>,</p>
              <p className="pl-4 text-zinc-300">&quot;firmware&quot;: &quot;v3.1.2-stable&quot;</p>
              <p className="text-zinc-300">{'}'}</p>
              <p className="text-zinc-500 pt-6">{'// Listen for Webhooks'}</p>
              <p className="text-blue-400">await <span className="text-zinc-300">scale.on(</span><span className="text-yellow-500">&apos;session_start&apos;</span><span className="text-zinc-300">, (data) =&gt; {'{'}</span></p>
              <p className="pl-4 text-zinc-300">notifyNetworkManager(data.id);</p>
              <p className="text-zinc-300">{'}'});</p>
            </div>
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-10 -right-4 bg-card text-card-foreground p-6 rounded-xl shadow-2xl border border-border hidden md:block"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
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
