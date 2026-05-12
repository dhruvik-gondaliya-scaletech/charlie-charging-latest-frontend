'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function Testimonials() {
  const testimonials = [
    {
      quote: "Managing 5,000+ points across Europe used to be a nightmare. Scale EV gave us the visibility we needed to reach 98% network uptime.",
      author: "Alex",
      role: "Founder, Charli Charging",
      avatar: "/assets/alex.png",
    },
    {
      quote: "Scale EV's reliable OCPP 1.6 implementation saved our network months of manual migration. The telemetry accuracy is simply unmatched.",
      author: "Marcelo",
      role: "CTO, Charli Charging",
      avatar: "/assets/marcelo.jpg",
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-muted/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Customer Testimonials</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-6">
            What Our Customers Are Saying
          </h2>
          <p className="text-muted-foreground text-lg">
            Scale EV is trusted by industry leaders to power the next generation of charging infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card p-10 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col"
            >
              <p className="text-lg text-foreground/90 italic mb-10 leading-relaxed">
                &quot;{t.quote}&quot;
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10">
                  <Image
                    src={t.avatar}
                    alt={t.author}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-bold text-foreground leading-tight">{t.author}</p>
                  <p className="text-xs text-muted-foreground font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
