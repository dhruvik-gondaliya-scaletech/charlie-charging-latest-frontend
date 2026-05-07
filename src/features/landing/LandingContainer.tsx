import { PublicHeader } from './components/PublicHeader';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { Features } from './components/Features';
import { AppPreview } from './components/AppPreview';
import { FAQ } from './components/FAQ';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { PublicFooter } from './components/PublicFooter';
import { SolutionsGrid } from './components/SolutionsGrid';
import { StatsSection } from './components/StatsSection';
import { PartnershipSection } from './components/PartnershipSection';
import { FeaturesCarousel } from './components/FeaturesCarousel';

export default function LandingContainer() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary antialiased">
      <PublicHeader />
      <main>
        <Hero />

        <TrustBar />

        <PartnershipSection />
        
        {/* Accelerate your business section */}
        <Features />

        {/* Slanted background features carousel */}
        <FeaturesCarousel />

        {/* Comprehensive Solutions Grid */}
        <SolutionsGrid />

        {/* Impact Stats */}
        <StatsSection />

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
