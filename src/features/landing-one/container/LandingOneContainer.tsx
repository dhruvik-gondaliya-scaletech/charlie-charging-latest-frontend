'use client';

import React from 'react';
import { HeaderSection } from '../components/HeaderSection';
import { HeroSection } from '../components/HeroSection';
import { PainPointsSection } from '../components/PainPointsSection';
import { SolutionsSection } from '../components/SolutionsSection';
import { WhiteLabelAppSection } from '../components/WhiteLabelAppSection';
import { PlatformFlowSection } from '../components/PlatformFlowSection';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { DemoCtaSection } from '../components/DemoCtaSection';
import { FooterSection } from '../components/FooterSection';

export function LandingOneContainer() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Sticky Top Universal Header */}
      <HeaderSection />

      {/* Main flow orchestration */}
      <main>
        <HeroSection />
        <PainPointsSection />
        <SolutionsSection />
        <WhiteLabelAppSection />
        <PlatformFlowSection />
        <AnalyticsSection />
        <TestimonialsSection />
        <DemoCtaSection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
