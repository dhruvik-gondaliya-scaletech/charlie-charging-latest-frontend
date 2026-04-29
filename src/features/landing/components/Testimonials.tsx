'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function Testimonials() {
  const testimonials = [
    {
      quote: "Charli Charging's transition to OCPP 2.0.1 saved our network months of manual migration. The telemetry accuracy is simply unmatched.",
      author: "Marcelo",
      role: "CTO, Charli Charging",
      avatar: "/assets/marcelo.jpg",
    },
    {
      quote: "Managing 5,000+ points across Europe used to be a nightmare. Charli Charging gave us the visibility we needed to reach 98% network uptime.",
      author: "Alex",
      role: "Founder, Charli Charging",
      avatar: "/assets/alex.png",
      featured: true
    }
  ];

  return (
    <section className="py-24 px-8 bg-muted/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-64 h-64 bg-primary/3 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold tracking-tighter text-foreground mb-4"
          >
            Voices from the front line.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground font-medium"
          >
            Trusted by the leaders who are building the infrastructure of tomorrow.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`
                group p-8 lg:p-12 rounded-[2.5rem] relative transition-all duration-500 hover:scale-[1.01]
                ${t.featured
                  ? 'bg-foreground text-background shadow-2xl shadow-primary/10'
                  : 'bg-card/50 backdrop-blur-xl border border-border shadow-sm hover:border-primary/20'
                }
              `}
            >
              <div className={`
                absolute top-8 right-10 text-8xl font-serif opacity-10 pointer-events-none select-none
                ${t.featured ? 'text-background' : 'text-foreground'}
              `}>
                &quot;
              </div>

              <p className={`
                text-xl lg:text-2xl mb-12 relative z-10 leading-relaxed font-bold tracking-tight
                ${t.featured ? 'text-background/90' : 'text-foreground/90'}
              `}>
                &quot;{t.quote}&quot;
              </p>

              <div className="flex items-center gap-5 mt-auto">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 border-2 border-border/20 shadow-lg">
                  <Image
                    src={t.avatar}
                    alt={t.author || "Testimonial Author"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className={`text-base font-black tracking-tight ${t.featured ? 'text-background' : 'text-foreground'}`}>
                    {t.author}
                  </p>
                  <p className={`text-xs font-bold uppercase tracking-widest ${t.featured ? 'text-background/60' : 'text-muted-foreground/80'}`}>
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
