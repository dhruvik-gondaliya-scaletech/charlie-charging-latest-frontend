'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Terminal, Code2, Cpu } from 'lucide-react';

export function ProtocolSpecs() {
  return (
    <section id="protocols" className="py-32 px-8 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Technical Excellence</span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-10 leading-[0.95] text-foreground">
            Built for <br /><span className="text-muted-foreground">developers.</span>
          </h2>
          <p className="text-muted-foreground text-xl mb-12 leading-relaxed font-medium max-w-xl">
            We don&apos;t just support protocols; we define how they operate at scale. Full compliance with OCPP 1.6 ensures reliability across your entire hardware fleet.
          </p>
          <ul className="space-y-8">
            {[
              { title: 'OCPP 1.6 J', desc: 'Industry-leading message queue handling for high-density networks.' },
              { title: 'Smart Charging', desc: 'Automated load balancing and power management across stations.' },
              { title: 'Developer API', desc: 'RESTful architecture with GraphQL support for complex data queries.' }
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-5">
                <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground mb-1">{item.title}</p>
                  <p className="text-muted-foreground font-medium">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative perspective-2000"
        >
          <div className="relative bg-zinc-950 rounded-[2.5rem] border border-white/10 p-10 font-mono text-sm shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden group">
            <div className="flex gap-2 mb-10">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
            </div>
            <div className="space-y-4">
              <p className="text-zinc-600 italic">{'// Initialize Charging Station Connect'}</p>
              <div className="flex gap-3">
                <span className="text-emerald-400 font-black">POST</span>
                <span className="text-zinc-400">/api/v1/stations/boot</span>
              </div>
              <div className="pl-4 space-y-1 border-l border-white/5">
                <p className="text-zinc-300">{"{"}</p>
                <p className="pl-4 text-zinc-300">&quot;stationId&quot;: <span className="text-primary">&quot;EV-LON-042&quot;</span>,</p>
                <p className="pl-4 text-zinc-300">&quot;protocol&quot;: <span className="text-primary">&quot;OCPP_1_6&quot;</span>,</p>
                <p className="pl-4 text-zinc-300">&quot;status&quot;: <span className="text-yellow-500">&quot;Available&quot;</span>,</p>
                <p className="pl-4 text-zinc-300">&quot;firmware&quot;: <span className="text-primary">&quot;v3.1.2-stable&quot;</span></p>
                <p className="text-zinc-300">{"}"}</p>
              </div>
              <p className="text-zinc-600 italic pt-6">{'// Listen for Webhooks'}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-blue-400">await</span>
                <span className="text-zinc-300">scale.on(</span>
                <span className="text-yellow-500">&apos;session_start&apos;</span>
                <span className="text-zinc-300">, (data) =&gt; {"{"}</span>
              </div>
              <p className="pl-8 text-zinc-300">notifyNetworkManager(data.id);</p>
              <p className="text-zinc-300">{"});"}</p>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-8 -right-4 bg-card/80 backdrop-blur-2xl text-card-foreground p-6 rounded-2xl shadow-2xl border border-border/50 hidden md:block"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Terminal className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">API Health</p>
                <p className="text-lg font-bold">99.99% Uptime</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

