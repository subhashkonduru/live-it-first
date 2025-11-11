import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { FeaturedExperiences } from "@/components/FeaturedExperiences";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustSignals } from "@/components/TrustSignals";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <TrustSignals />
        <FeaturedExperiences />
        <HowItWorks />
        <FeatureHighlights />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
