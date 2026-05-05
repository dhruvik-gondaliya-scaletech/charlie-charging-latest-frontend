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
import { SolutionsGrid } from './components/SolutionsGrid';
import { StatsSection } from './components/StatsSection';
import { PartnershipSection } from './components/PartnershipSection';
import { FeaturesCarousel } from './components/FeaturesCarousel';
import { GlobalNetwork } from './components/GlobalNetwork';
import { FleetCharging } from './components/FleetCharging';

export default function LandingContainer() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary antialiased">
      <PublicHeader />
      <main>
        <Hero />
        <PartnershipSection />
        
        {/* Accelerate your business section */}
        <Features />

        {/* Slanted background features carousel */}
        <FeaturesCarousel />

        {/* Comprehensive Solutions Grid */}
        <SolutionsGrid />

        {/* Impact Stats */}
        <StatsSection />

        {/* Global Reach Map */}
        <GlobalNetwork />

        {/* Fleet Specifics */}
        <FleetCharging />

        {/* Social Proof */}
        <Testimonials />

        {/* Optional: App Preview */}
        <AppPreview />

        <FAQ />
        
        <ContactSection />
      </main>
      <PublicFooter />
    </div>
  );
}
