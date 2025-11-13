import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "@/lib/lucide-stub";
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

  const headline = ["Pre-Experience Once.", "Decide for Life with Confidence."];

  return (
  <section aria-label="Homepage hero" className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden text-primary-foreground">
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
  <div className="absolute inset-0 overlay-gradient" />
      </div>

      <div ref={midRef} className="absolute inset-0 z-5 pointer-events-none opacity-90" style={{ transform: 'translateY(0px)' }}>
        <div className="absolute -left-28 -top-12 w-80 h-80 bg-primary/18 rounded-full blur-3xl floaty" />
        <div className="absolute right-12 top-24 w-64 h-64 bg-gold/12 rounded-full blur-2xl floaty" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-28 w-96 h-96 bg-primary/8 rounded-full blur-2xl" />
      </div>

  <div className="relative z-10 container mx-auto px-6 text-center text-primary-foreground">
        <div className="hero-text-wrap mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight hero-headline">
          {headline.map((line, idx) => (
            <div key={idx} className={`fade-up`} style={{ animationDelay: `${idx * 120}ms` }}>
                {idx === 1 ? (
                <span>{line}</span>
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}
        </h1>

        <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-3xl mx-auto font-light fade-up" style={{ animationDelay: '260ms' }}>
          Book a 3–7 day trial stay to experience a home before you commit.
        </p>

        {/* Frosted CTA Panel inside the text wrap so buttons sit on the backdrop */}
        <div className="mt-6 flex justify-center">
            <div className="fade-up" style={{ animationDelay: '340ms' }}>
            <div className="inline-flex items-center gap-6 bg-card/6 backdrop-blur-md border border-border rounded-2xl px-6 py-4 shadow-xl">
                <div className="text-left">
                <div className="text-sm text-muted-foreground">Selected stays</div>
                <div className="text-lg font-semibold">Selected homes</div>
              </div>

              <div className="flex gap-3 items-center">
                <Link to="/search" aria-label="Explore experiences">
                  <Button
                    variant="gold"
                    size="lg"
                    className="transform transition-all hover:-translate-y-0.5"
                    style={{
                      backgroundImage: 'var(--gradient-primary)',
                      color: 'hsl(var(--gold-foreground))',
                      boxShadow: '0 12px 30px hsl(var(--overlay) / 0.35)'
                    }}
                  >
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link to="/host" aria-label="Become a host">
                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:bg-primary/5"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid hsl(var(--gold) / 0.95)',
                      color: 'hsl(var(--gold))',
                    }}
                  >
                    List your home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>

            <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground fade-up" style={{ animationDelay: '520ms' }}>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-gold/30 px-3 py-1 text-gold font-medium">Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-card/6 px-3 py-1">Secure payments</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-card/6 px-3 py-1">Verified</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-wider">Scroll to discover</span>
          <div className="h-8 w-px bg-border/30 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
