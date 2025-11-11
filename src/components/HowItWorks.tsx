import { Search, Calendar, Key, Heart } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Discover",
      description: "Browse curated properties and filter by location, duration, and experience type. Every listing includes detailed itineraries and sensory details."
    },
    {
      icon: Calendar,
      title: "Schedule Your Trial",
      description: "Select your preferred dates for a 3-7 day immersive stay. Coordinate with verified hosts and complete secure booking in minutes."
    },
    {
      icon: Key,
      title: "Experience the Space",
      description: "Seamless check-in with digital agreements. Live authentically in the property, test the commute, explore the neighborhood, feel the light."
    },
    {
      icon: Heart,
      title: "Decide with Confidence",
      description: "After your trial, you'll know if it's the right fit. Ready to commit? We'll connect you directly with the listing agent or owner."
    }
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-primary font-medium mb-3 tracking-wide uppercase text-sm">
            The Process
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            We've reimagined property discovery. Experience before you invest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line (hidden on mobile, shown on larger screens) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
                )}
                
                <div className="relative bg-card rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary mb-6">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
