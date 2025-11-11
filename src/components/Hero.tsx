import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export const Hero = () => {
  const bgRef = useRef<HTMLDivElement | null>(null);
  const midRef = useRef<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    try { mq.addEventListener('change', onChange); } catch(e) { mq.addListener(onChange); }
    return () => { try { mq.removeEventListener('change', onChange); } catch(e) { mq.removeListener(onChange); } };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let rafId: number | null = null;
    function onScroll() {
      if (!bgRef.current || !midRef.current) return;
      const scrolled = window.scrollY;
      bgRef.current.style.transform = `translateY(${scrolled * 0.15}px)`;
      midRef.current.style.transform = `translateY(${scrolled * 0.25}px)`;
    }
    function loop() { onScroll(); rafId = requestAnimationFrame(loop); }
    rafId = requestAnimationFrame(loop);
    return () => { if (rafId) cancelAnimationFrame(rafId); };
  }, [prefersReducedMotion]);

  const headline = ["Live it for 3 days.", "Decide for life."];

  return (
    <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform" style={{ transform: 'translateY(0px)' }}>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.55) contrast(1.02)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/55" />
      </div>

      <div ref={midRef} className="absolute inset-0 z-5 pointer-events-none opacity-80" style={{ transform: 'translateY(0px)' }}>
        <div className="absolute -left-20 -top-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl floaty" />
        <div className="absolute right-8 top-32 w-56 h-56 bg-gold/10 rounded-full blur-2xl floaty" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-24 w-80 h-80 bg-primary/8 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
          {headline.map((line, idx) => (
            <div key={idx} className={`fade-up`} style={{ animationDelay: `${idx * 120}ms` }}>
              {idx === 1 ? <span className="text-gold">{line}</span> : line}
            </div>
          ))}
        </h1>

        <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto font-light fade-up" style={{ animationDelay: '260ms' }}>
          Experience your future home before you commit. Book immersive 3–7 day trial stays in premium properties worldwide.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-up" style={{ animationDelay: '380ms' }}>
          <Link to="/search">
            <Button variant="premium" size="xl" className="cta-glow">
              Explore Experiences
              <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Link to="/how-it-works">
            <Button variant="outline" size="xl" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              <Calendar className="mr-2 h-5 w-5" />
              How it works
            </Button>
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-white/80 fade-up" style={{ animationDelay: '520ms' }}>
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-xs uppercase tracking-wider">Scroll to discover</span>
          <div className="h-8 w-px bg-white/30 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
