import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { FeaturedExperiences } from "@/components/FeaturedExperiences";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustSignals } from "@/components/TrustSignals";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        {/* Quick links / Feature cards for visibility */}
        <section className="container mx-auto px-6 py-10">
          <h2 className="text-2xl font-semibold mb-4">Quick links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <Link to="/search" className="bg-card p-3 rounded shadow-sm text-center hover:shadow-md">Explore stays</Link>
            <Link to="/host" className="bg-card p-3 rounded shadow-sm text-center hover:shadow-md">Become a host</Link>
            <Link to="/booking/" className="bg-card p-3 rounded shadow-sm text-center hover:shadow-md">Start a booking</Link>
            <Link to="/bookings/" className="bg-card p-3 rounded shadow-sm text-center hover:shadow-md">My bookings</Link>
            <Link to="/dashboard/guest" className="bg-card p-3 rounded shadow-sm text-center hover:shadow-md">Guest dashboard</Link>
            <Link to="/dashboard/host" className="bg-card p-3 rounded shadow-sm text-center hover:shadow-md">Host dashboard</Link>
            <Link to="/login" className="bg-card p-3 rounded shadow-sm text-center hover:shadow-md">Login</Link>
            <Link to="/register" className="bg-card p-3 rounded shadow-sm text-center hover:shadow-md">Register</Link>
            <Link to="/how-it-works" className="bg-card p-3 rounded shadow-sm text-center hover:shadow-md">How it works</Link>
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
