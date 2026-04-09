'use client';

import Image from 'next/image';

export function TrustBar() {
  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-12">
        <p className="text-center text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground mb-4 opacity-70">
          Powering the next generation of charging
        </p>
        <div className="flex justify-center items-center">
          <Image 
            src="/assets/charli_charging.svg" 
            alt="Charli Charging" 
            width={400} 
            height={120} 
            className="h-32 w-auto object-contain transition-all duration-300 hover:scale-105"
            priority
          />
        </div>
      </div>
    </section>
  );
}
