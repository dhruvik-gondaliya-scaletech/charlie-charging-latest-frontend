import { PublicHeader } from './components/PublicHeader';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { PainPoints } from './components/PainPoints';
import { Features } from './components/Features';
import { PlatformWorkflow } from './components/PlatformWorkflow';
import { AppPreview } from './components/AppPreview';
import { AnalyticsSection } from './components/AnalyticsSection';
import { Testimonials } from './components/Testimonials';
import { StatsSection } from './components/StatsSection';
import { Industries } from './components/Industries';
import { FAQ } from './components/FAQ';
import { CTASection } from './components/CTASection';
import { ContactSection } from './components/ContactSection';
import { PublicFooter } from './components/PublicFooter';

export default function LandingContainer() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary antialiased">
      <PublicHeader />
      <main>
        {/* 1. Hero — Full-screen cinematic hero */}
        <Hero />

        {/* 2. Trust Bar — Compliance badges & partner logos */}
        <TrustBar />

        {/* 3. Pain Points — 8-card problem grid */}
        <PainPoints />

        {/* 4. Features / Solutions — 12 platform capabilities */}
        <Features />

        {/* 5. Platform Workflow — 5-step animated flow */}
        <PlatformWorkflow />

        {/* 6. White-Label Driver App — Mobile app showcase */}
        <AppPreview />

        {/* 7. Analytics & Dashboard — Real-time intelligence */}
        <AnalyticsSection />

        {/* 8. Impact Stats — Animated counters */}
        <StatsSection />

        {/* 9. Testimonials — Client proof */}
        <Testimonials />

        {/* 10. Industries — 8 ecosystem verticals */}
        <Industries />

        {/* 11. FAQ */}
        <FAQ />

        {/* 12. CTA Section — Demo / Talk to sales */}
        <CTASection />

        {/* 13. Contact Form */}
        <ContactSection />
      </main>
      <PublicFooter />
    </div>
  );
}
