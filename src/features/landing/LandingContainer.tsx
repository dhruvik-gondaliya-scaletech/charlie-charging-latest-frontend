'use client';

import { PublicHeader } from './components/PublicHeader';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { Features } from './components/Features';
import { ProtocolSpecs } from './components/ProtocolSpecs';
import { Testimonials } from './components/Testimonials';
import { CTASection } from './components/CTASection';
import { PublicFooter } from './components/PublicFooter';

export default function LandingContainer() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] selection:bg-black selection:text-white antialiased">
      <PublicHeader />
      <main>
        <Hero />
        <TrustBar />
        <Features />
        <ProtocolSpecs />
        <Testimonials />
        <CTASection />
      </main>
      <PublicFooter />
    </div>
  );
}
