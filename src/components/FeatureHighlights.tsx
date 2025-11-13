import { FileCheck, CreditCard, Lock, MapPin, Shield } from "@/lib/lucide-stub";
import { Button } from "./ui/button";

export const FeatureHighlights = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <p className="text-primary font-medium mb-3 tracking-wide uppercase text-sm">
              Seamless Experience
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need for a worry-free trial
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              From secure booking to automated check-in, we've designed every touchpoint to be simple and reliable.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div aria-hidden className="shrink-0 w-12 h-12 rounded-lg bg-panel text-primary flex items-center justify-center border border-border shadow-sm">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Digital Agreements</h3>
                  <p className="text-muted-foreground">Legally binding e-signature process. Quick, secure, timestamped.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div aria-hidden className="shrink-0 w-12 h-12 rounded-lg bg-panel text-primary flex items-center justify-center border border-border shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Smart Check-In/Out</h3>
                  <p className="text-muted-foreground">Contactless access via smart locks or secure OTP. No keys, no hassle.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div aria-hidden className="shrink-0 w-12 h-12 rounded-lg bg-panel text-primary flex items-center justify-center border border-border shadow-sm">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Transparent Pricing</h3>
                  <p className="text-muted-foreground">Clear fee breakdown. Secure payments. Automated invoices and receipts.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div aria-hidden className="shrink-0 w-12 h-12 rounded-lg bg-panel text-primary flex items-center justify-center border border-border shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Neighborhood Insights</h3>
                  <p className="text-muted-foreground">Commute times, local amenities, noise levels, and light quality reports.</p>
                </div>
              </div>
            </div>

            <Button variant="gold" size="lg" aria-label="Learn more about features">
              Learn more
            </Button>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="rounded-2xl bg-panel p-8 md:p-12 flex items-center justify-center min-h-[320px] md:min-h-[420px] border border-border shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 items-center text-center w-full">
                <div className="mx-auto">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/12">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gold flex items-center justify-center">
                        <Shield className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-4xl md:text-5xl font-extrabold text-foreground mb-1">98%</div>
                  <div className="text-lg font-medium text-muted-foreground">Success Rate</div>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                    Of guests complete automated check-in without issues
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Elements (muted) */}
            <div aria-hidden className="absolute -top-6 -right-6 w-28 h-28 bg-gold/10 rounded-full filter blur-2xl" />
            <div aria-hidden className="absolute -bottom-6 -left-6 w-36 h-36 bg-primary/8 rounded-full filter blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
