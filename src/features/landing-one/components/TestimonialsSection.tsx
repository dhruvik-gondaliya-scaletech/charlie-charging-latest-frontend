'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Quote, 
  CheckCircle2, 
  Star, 
  Building2,
  MessageSquareQuote
} from 'lucide-react';

const testimonials = [
  {
    quote: "Scale EV handled our migration of 1,200 public fast chargers flawlessly. The native OCPP 1.6J stability and automated peak load balancing saved us over $140K in utility demand tariffs in the first quarter alone.",
    author: "Marcus Vance",
    role: "VP of Infrastructure",
    company: "Nordic ChargeNet",
    tag: "Scalability",
    accent: "from-primary/20 via-primary/5 to-transparent",
    borderAccent: "group-hover:border-primary/50",
    avatar: "MV",
  },
  {
    quote: "Deploying our fully customized iOS and Android driver app took less than three weeks using Scale EV's white-label pipeline. Our app rating jumped from 2.4 to 4.8 stars instantly.",
    author: "Sarah Jenkins",
    role: "Chief Product Officer",
    company: "VoltRoaming UK",
    tag: "Delivery Speed",
    accent: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    borderAccent: "group-hover:border-cyan-500/50",
    avatar: "SJ",
  },
  {
    quote: "The low-level firmware injection capability and hardware diagnostics interface gives our field teams absolute command. We resolve 85% of stall alerts remotely without deploying expensive technician trucks.",
    author: "David Almansi",
    role: "Director of Network Operations",
    company: "Iberia EV Grid",
    tag: "OCPP Stability",
    accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    borderAccent: "group-hover:border-emerald-500/50",
    avatar: "DA",
  },
  {
    quote: "Their enterprise support SLA is legendary. We had a complex roaming certificate settlement issue on a Saturday night, and their engineering tier-3 team resolved the TLS handshake within 14 minutes.",
    author: "Elena Rostova",
    role: "Managing Director",
    company: "CEE Charge Hub",
    tag: "Support Response",
    accent: "from-purple-500/20 via-purple-500/5 to-transparent",
    borderAccent: "group-hover:border-purple-500/50",
    avatar: "ER",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-4 border border-primary/20">
            <MessageSquareQuote className="h-3 w-3 text-primary" />
            Operator Endorsements
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-5">
            Trusted by Forward-Thinking{' '}
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent block sm:inline">
              Charge Point Operators
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Discover how enterprise operators leverage our scalable protocol brokers to eliminate driver friction and maximize real asset yield.
          </p>
        </motion.div>

        {/* Testimonials Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`
                rounded-2xl border border-border/80 dark:border-white/10 bg-card/40 dark:bg-card/20 backdrop-blur-xl p-8 relative overflow-hidden flex flex-col justify-between group transition-all duration-300
                hover:shadow-2xl hover:bg-card/80 dark:hover:bg-card/40 ${item.borderAccent}
              `}
            >
              {/* Internal subtle gradient overlay slice */}
              <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${item.accent} opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none -z-10`} />

              {/* Quote Mark and Tag layout */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  {/* Decorative quote wrapper */}
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Quote className="h-5 w-5 fill-primary/20" />
                  </div>

                  {/* Core Tag highlight */}
                  <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-background border border-border/60 text-muted-foreground group-hover:text-foreground transition-colors shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  ))}
                  <span className="text-[10px] font-bold text-muted-foreground ml-1.5">5.0 Verified SLA</span>
                </div>

                {/* Quote Content */}
                <p className="text-foreground text-sm sm:text-base leading-relaxed italic mb-8">
                  "{item.quote}"
                </p>
              </div>

              {/* Layered Author Profile footer */}
              <div className="flex items-center justify-between pt-5 border-t border-border/40 mt-auto">
                <div className="flex items-center gap-3">
                  {/* Styled avatar badge */}
                  <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs flex items-center justify-center shadow-md">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                      {item.author}
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* Company indicator */}
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Operator</span>
                  <span className="text-xs font-extrabold text-primary flex items-center gap-1 justify-end mt-0.5">
                    <Building2 className="h-3 w-3 shrink-0" />
                    {item.company}
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
