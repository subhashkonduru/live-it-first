import { PropertyCard } from "./PropertyCard";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

export const FeaturedExperiences = () => {
  const properties = [
    {
      image: property1,
      title: "Skyline Penthouse with City Views",
      location: "Manhattan, New York",
      duration: "3-7 days",
      price: 4500,
      rating: 4.9,
      reviews: 127,
      experienceType: "Urban Living",
      availability: "Available Now" as const
    },
    {
      image: property2,
      title: "Contemporary Residence with Design Studio",
      location: "Chelsea, London",
      duration: "3-7 days",
      price: 5200,
      rating: 4.8,
      reviews: 93,
      experienceType: "Creative Space",
      availability: "Limited Slots" as const
    },
    {
      image: property3,
      title: "Coastal Villa with Infinity Views",
      location: "Santorini, Greece",
      duration: "5-7 days",
      price: 6800,
      rating: 5.0,
      reviews: 156,
      experienceType: "Lifestyle Escape",
      availability: "Available Now" as const
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-primary font-medium mb-3 tracking-wide uppercase text-sm">
            Featured
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured Trial Experiences
          </h2>
          <p className="text-xl text-muted-foreground">
            Properties selected for trial stays so you can experience living in them before deciding.
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property, index) => (
            <PropertyCard key={index} {...property} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="text-primary font-semibold hover:text-primary-glow transition-colors inline-flex items-center gap-2 group">
            View All Experiences
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
