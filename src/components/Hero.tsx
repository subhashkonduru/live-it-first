import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";

export const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Hero Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight">
          Live it for 3 days.<br />
          <span className="text-gold">Decide for life.</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto font-light">
          Experience your future home before you commit. Book immersive 3–7 day trial stays in premium properties worldwide.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="gold" size="xl" className="group">
            Explore Experiences
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="xl" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
            <Calendar className="mr-2 h-5 w-5" />
            Browse Calendar
          </Button>
        </div>

        {/* Trust Strip */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-gold rounded-full" />
            <span>Verified Properties</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-gold rounded-full" />
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-gold rounded-full" />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-wider">Scroll to discover</span>
          <div className="h-8 w-px bg-white/30 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
