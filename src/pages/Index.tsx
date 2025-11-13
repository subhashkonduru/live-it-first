import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { FeaturedExperiences } from "@/components/FeaturedExperiences";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustSignals } from "@/components/TrustSignals";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Link } from 'react-router-dom';
import { quickLinks } from '@/lib/menu';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen landing-background">
      <Navigation />
      <main>
        <Hero />
        {/* Quick links / Feature cards for visibility */}
  {/* Quick links: hidden on md+ to avoid duplicating top navigation; visible on mobile */}
  <section className="container mx-auto px-6 py-10 md:hidden">
          <h2 className="text-2xl font-semibold mb-4">Quick links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/** Use shared quickLinks definition so these stay aligned with top menu. Use buttons for better tap targets on mobile. */}
            {quickLinks.map((q) => (
              <div key={q.to} className="w-full">
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link to={q.to} className="w-full text-center">{q.label}</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
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
