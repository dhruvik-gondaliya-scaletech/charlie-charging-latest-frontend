'use client';

import { PublicHeader } from './components/PublicHeader';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { Features } from './components/Features';
import { ProtocolSpecs } from './components/ProtocolSpecs';
import { AppPreview } from './components/AppPreview';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { PublicFooter } from './components/PublicFooter';

export default function LandingContainer() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary antialiased">
      <PublicHeader />
      <main>
        <Hero />
        <TrustBar />
        <div id="features">
          <Features />
        </div>
        <div id="protocols">
          <ProtocolSpecs />
        </div>
        <div id="app">
          <AppPreview />
        </div>
        <Testimonials />
        {/* <Pricing /> */}
        <FAQ />
        <ContactSection />
      </main>
      <PublicFooter />
    </div>
  );
}
