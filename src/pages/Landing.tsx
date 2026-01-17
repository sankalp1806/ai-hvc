import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { MethodologySection } from '@/components/landing/MethodologySection';
import { WhoItsForSection } from '@/components/landing/WhoItsForSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { Footer } from '@/components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <MethodologySection />
      <WhoItsForSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Landing;
