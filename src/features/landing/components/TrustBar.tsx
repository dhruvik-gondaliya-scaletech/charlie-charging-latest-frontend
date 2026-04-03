'use client';

export function TrustBar() {
  const logos = [
    { name: 'VOLT', italic: true, tracking: 'tighter' },
    { name: 'NEXUS', tracking: 'widest' },
    { name: 'GRID', icon: true },
    { name: 'SPARK', underline: true },
    { name: 'AMPLIFY', uppercase: true, tracking: 'tighter' }
  ];

  return (
    <section className="py-12 bg-[#f3f3f4] border-y border-black/5">
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-center text-[10px] font-black tracking-[0.3em] uppercase text-[#474747] mb-10 opacity-60">
          Trusted by 500+ global networks
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale contrast-125">
          {logos.map((logo, idx) => (
            <span 
              key={idx} 
              className={`text-2xl font-black text-black ${logo.italic ? 'italic' : ''} ${logo.tracking === 'tighter' ? 'tracking-tighter' : logo.tracking === 'widest' ? 'tracking-widest' : ''} ${logo.uppercase ? 'uppercase' : ''} ${logo.underline ? 'underline decoration-4' : ''} flex items-center gap-1`}
            >
              {logo.icon && <div className="h-5 w-5 bg-black rounded-full" />}
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
