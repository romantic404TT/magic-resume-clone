import { LandingHeader } from "@/components/home/LandingHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection, LandingFooter } from "@/components/home/CTASection";

export const LandingPage = () => (
  <div className="flex min-h-screen flex-col">
    <LandingHeader />
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
      <CTASection />
    </main>
    <LandingFooter />
  </div>
);
