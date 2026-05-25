'use client';

import React from 'react';
import { NavbarSection } from '../components/NavbarSection';
import { HeroSection } from '../components/HeroSection';
import { TrustedBrandsSection } from '../components/TrustedBrandsSection';
import { SolutionsSection } from '../components/SolutionsSection';
import { FeaturesGridSection } from '../components/FeaturesGridSection';
import { WorkflowSection } from '../components/WorkflowSection';
import { GlobalPresenceSection } from '../components/GlobalPresenceSection';
import { IndustrySolutionsSection } from '../components/IndustrySolutionsSection';
import { PartnersSection } from '../components/PartnersSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { BlogSection } from '../components/BlogSection';
import { FAQSection } from '../components/FAQSection';
import { CTASection } from '../components/CTASection';
import { FooterSection } from '../components/FooterSection';

export default function LandingFourContainer() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans scroll-smooth antialiased">
      {/* Sticky Header Nav */}
      <NavbarSection />

      <main className="relative flex flex-col">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Trusted Brand Logos Grid */}
        <TrustedBrandsSection />

        {/* 3. Solutions Grid */}
        <SolutionsSection />

        {/* 4. Core Features Grid */}
        <FeaturesGridSection />

        {/* 5. Onboarding Workflow Timeline */}
        <WorkflowSection />

        {/* 6. Global Presence World Map & Counters */}
        <GlobalPresenceSection />

        {/* 7. Industry Segments Deployment */}
        <IndustrySolutionsSection />

        {/* 8. Detailed Ecosystem Partners Catalog */}
        <PartnersSection />

        {/* 9. Testimonials Grid */}
        <TestimonialsSection />

        {/* 10. Technical Blog Deep-Dives */}
        <BlogSection />

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
