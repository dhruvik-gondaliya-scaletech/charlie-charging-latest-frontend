'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

const testimonials = [
  {
    quote: "Managing 5,000+ charging points across Europe used to be a nightmare. Scale EV gave us the real-time visibility we needed to reach 98% network uptime. It\'s the backbone of our entire operation.",
    author: "Alex",
    role: "Founder & CEO",
    company: "Charli Charging",
    initials: "AT",
    color: "bg-blue-500",
    rating: 5,
  },
  {
    quote: "Scale EV's OCPP implementation is rock-solid. We migrated 800 chargers in a weekend without a single outage. The remote management tools saved us hundreds of hours per month.",
    author: "Marcelo",
    role: "CTO",
    company: "Charli Charging",
    initials: "MS",
    color: "bg-emerald-500",
    rating: 5,
  },
  {
    quote: "The white-label driver app is fantastic. Our customers constantly comment on how smooth the charging experience is. We launched our branded app in just 2 weeks.",
    author: "Sarah Chen",
    role: "Head of Product",
    company: "FleetVolt Networks",
    initials: "SC",
    color: "bg-purple-500",
    rating: 5,
  },
  {
    quote: "The analytics dashboard gives us insights we never had before. We optimized charger placement across 12 sites and increased utilization by 34% in 3 months.",
    author: "James Okafor",
    role: "Operations Director",
    company: "GridPoint Mobility",
    initials: "JO",
    color: "bg-orange-500",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-28 px-6 lg:px-8 bg-muted/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-primary font-black tracking-[0.2em] uppercase text-[11px] mb-5">Testimonials</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            What Our <span className="text-primary">Clients</span> Say
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Scale EV is trusted by operators who demand operational excellence and infrastructure that scales.
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/25 hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-6 text-7xl font-serif text-primary/8 leading-none select-none pointer-events-none">
                &#8220;
              </div>

              <div className="mb-5">
                <StarRating count={t.rating} />
              </div>

              <p className="text-foreground/90 text-base leading-relaxed mb-8 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white font-black text-sm">{t.initials}</span>
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm leading-tight">{t.author}</p>
                  <p className="text-xs text-muted-foreground font-medium">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 py-8 border-t border-border/30"
        >
          {[
            { metric: '50+', label: 'Operators globally' },
            { metric: '99.9%', label: 'Uptime SLA' },
            { metric: '2M+', label: 'Sessions managed' },
            { metric: '4.9/5', label: 'Client rating' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold text-foreground">{s.metric}</p>
              <p className="text-xs text-muted-foreground font-semibold">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
