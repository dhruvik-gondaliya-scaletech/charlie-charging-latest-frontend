'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function Testimonials() {
  const testimonials = [
    {
      quote: "Scale EV's transition to OCPP 2.0.1 saved our network months of manual migration. The telemetry accuracy is simply unmatched.",
      author: "Marcus Chen",
      role: "CTO, ElectraPath",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuNS6OrlKan9gdxTsCwn6mYGBYGfFohL4N_jIqb6R_ZfR4Btp9MJGh6WCHssklIHbsCJEb5TUwjqssvINgnWxQ7mDD9KUUggw1Pt7_u0DPAoL-20KiqKMEoLqvYfRkjj0sN5fx5I7s3q6PME3DxxYZB80TDE0G6hiItb7Ehf8AaFHQ0GGzAVnbBhx8tmK86lSsGMO2FZfFqHvLKC5RRdOkHEHsyjiR3dsk6AI1EpAc3QpC9CjRfIILS_IQVrDITcv0mFKemuec9H5G"
    },
    {
      quote: "Managing 5,000+ points across Europe used to be a nightmare. Scale EV gave us the visibility we needed to reach 98% network uptime.",
      author: "Sarah Jenkins",
      role: "Director of Ops, GridGlobal",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuClxRTtomLAC3b59VUyT6slkZGAzVuGEA6pgMNLtPG6yrLOcKcHmv1RwVHFiUouvSZpKVvGKgs9Ooufg6UHmWOCZlHh7YyJx2aRvtmTzln4CN6S_uFoWvNmW1dPsnqUzO3WCxy4lyv0JoHwMM27OZOA8x4I0C1Fc69IbmcPg4WBVO1UjmNsWrVkNKLlE7loBC_vW9S-z8Z8I32jan8R4RZXXwY6Fnal3T8sPu517HS-PS0Z8A8i432047tin_WceFxPgBuOPZunFdKH",
      featured: true
    },
    {
      quote: "The roaming capabilities through OCPI were the turning point for our expansion. Integration was practically instantaneous.",
      author: "David Rossi",
      role: "VP Growth, ChargeStream",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCR__IMrkH_dxoRunFF3dHF7CaXfSEEmll34GrucnrrmsDEhxUjPss7wY610FMIJc2XdnyxuT7REhxxhQ6lA6DRV5AZTKM2YPZKTTqtNN1ntHfBeTi6L-N-yAYZchlutNnTbJp3z6zdkISB9sCICVcyBcYwzDBqsJqRCZUE9-7dEcC9rOjbnvm1Elgf8vR9qTfK74DKq-CpeXi5gVj-z1anOkpzKT9oba6hyzmMAQk2AmODQuIdYkSkIvtWm1WpZ5OpsNEyKyteytxT"
    }
  ];

  return (
    <section className="py-24 px-8 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl font-bold tracking-tighter mb-20 text-black">
          Voices from the front line.
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`${t.featured ? 'bg-black text-white shadow-2xl lg:-mt-6' : 'bg-white text-black border border-neutral-100'} p-10 rounded-2xl relative group`}
            >
              <span className="text-6xl absolute top-6 right-8 opacity-10 font-serif pointer-events-none">&quot;</span>
              <p className="text-lg mb-8 relative z-10 leading-relaxed italic font-medium">
                &quot;{t.quote}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden grayscale">
                  <Image 
                    src={t.avatar} 
                    alt={t.author || "Testimonial Author"} 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-bold text-sm">{t.author}</p>
                  <p className={`text-xs ${t.featured ? 'opacity-60' : 'text-[#474747]'}`}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
