import { Shield, Award, Clock, Users } from "lucide-react";

export const TrustSignals = () => {
  const signals = [
    {
      icon: Shield,
      stat: "100%",
      label: "Verified Properties",
      description: "Every listing undergoes rigorous verification"
    },
    {
      icon: Users,
      stat: "50K+",
      label: "Trial Experiences",
      description: "Hosted across 120 cities worldwide"
    },
    {
      icon: Award,
      stat: "4.9/5",
      label: "Average Rating",
      description: "From thousands of satisfied guests"
    },
    {
      icon: Clock,
      stat: "24/7",
      label: "Concierge Support",
      description: "Premium assistance throughout your stay"
    }
  ];

  return (
    <section className="py-20 border-t border-b border-border bg-card">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-1">{signal.stat}</div>
                <div className="font-semibold text-foreground mb-2">{signal.label}</div>
                <p className="text-sm text-muted-foreground">{signal.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
