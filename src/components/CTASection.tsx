import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow to-primary opacity-95" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yLTJ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0tMi0ydjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to experience your future home?
          </h2>
          <p className="text-xl mb-10 opacity-90 leading-relaxed">
            Join thousands of guests who've discovered their perfect space through our immersive trial experiences. Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="xl" className="group shadow-xl">
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="bg-white/10 text-primary-foreground border-white/30 hover:bg-white/20 shadow-lg"
            >
              Talk to Our Team
            </Button>
          </div>

          <p className="mt-8 text-sm opacity-75">
            No commitment required. Browse at your own pace.
          </p>
        </div>
      </div>
    </section>
  );
};
