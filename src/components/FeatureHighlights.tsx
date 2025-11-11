import { FileCheck, CreditCard, Lock, MapPin, Shield } from "lucide-react";
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
              From secure booking to automated check-in, we've designed every touchpoint to feel effortless and premium.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Digital Agreements</h3>
                  <p className="text-muted-foreground">Legally binding e-signature process. Quick, secure, timestamped.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Smart Check-In/Out</h3>
                  <p className="text-muted-foreground">Contactless access via smart locks or secure OTP. No keys, no hassle.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Transparent Pricing</h3>
                  <p className="text-muted-foreground">Clear fee breakdown. Secure payments. Automated invoices and receipts.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Neighborhood Insights</h3>
                  <p className="text-muted-foreground">Commute times, local amenities, noise levels, and light quality reports.</p>
                </div>
              </div>
            </div>

            <Button variant="premium" size="lg">
              Learn More About Our Process
            </Button>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary-glow/20 backdrop-blur-sm border border-primary/20 p-12 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">98%</div>
                  <div className="text-lg font-medium">Success Rate</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Of guests complete automated check-in without issues
                  </p>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
