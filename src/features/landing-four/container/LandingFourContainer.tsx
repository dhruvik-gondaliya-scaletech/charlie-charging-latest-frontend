import { NavbarSection } from '../components/NavbarSection';
import { HeroSection } from '../components/HeroSection';
import { SolutionsSection } from '../components/SolutionsSection';
import { IndustrySolutionsSection } from '../components/IndustrySolutionsSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FAQSection } from '../components/FAQSection';
import { CTASection } from '../components/CTASection';
import { FooterSection } from '../components/FooterSection';
import { TrustBar } from '@/features/landing/components/TrustBar';

export default function LandingFourContainer() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans scroll-smooth antialiased">
      {/* Sticky Header Nav */}
      <NavbarSection />

      <main className="relative flex flex-col">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Trusted Brand Logos Grid */}
        <TrustBar />

        {/* 3. Solutions Grid */}
        <SolutionsSection />

        {/* 9. Testimonials Grid */}
        <TestimonialsSection />

        {/* 11. FAQ Accordions */}
        <FAQSection />

        {/* 12. Conversion CTA Box */}
        <CTASection />
      </main>

      {/* 13. Multi-Column Footer */}
      <FooterSection />
    </div>
  );
}
