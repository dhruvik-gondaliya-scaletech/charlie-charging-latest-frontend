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
import { TestimonialsSection } from '../components/TestimonialsSection';
import { BlogSection } from '../components/BlogSection';
import { FAQSection } from '../components/FAQSection';
import { CTASection } from '../components/CTASection';
import { FooterSection } from '../components/FooterSection';

export function LandingFiveContainer() {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-blue-600 selection:text-white">
      <NavbarSection />
      <HeroSection />
      <TrustedBrandsSection />
      <SolutionsSection />
      <FeaturesGridSection />
      <WorkflowSection />
      <GlobalPresenceSection />
      <IndustrySolutionsSection />
      <TestimonialsSection />
      <BlogSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
export default LandingFiveContainer;
