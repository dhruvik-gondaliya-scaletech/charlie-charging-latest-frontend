import { NavbarSection } from '../components/NavbarSection';
import { HeroSection } from '../components/HeroSection';
import { SolutionsSection } from '../components/SolutionsSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FAQSection } from '../components/FAQSection';
import { CTASection } from '../components/CTASection';
import { ContactSection } from '../components/ContactSection';
import { FooterSection } from '../components/FooterSection';
import { TrustBar } from '../components/TrustBar';

export default function LandingContainer() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans scroll-smooth antialiased">
      <NavbarSection />
      <main className="relative flex flex-col">
        <HeroSection />
        <TrustBar />
        <SolutionsSection />
        <CTASection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}
