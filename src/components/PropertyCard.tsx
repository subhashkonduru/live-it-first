import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star } from "lucide-react";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  rating?: number;
  reviews?: number;
  experienceType: string;
  availability?: "Available Now" | "Limited Slots" | "Booking Soon";
}

export const PropertyCard = ({
  image,
  title,
  location,
  duration,
  price,
  rating,
  reviews,
  experienceType,
  availability
}: PropertyCardProps) => {
  return (
    <div className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-4">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-white/90 text-foreground hover:bg-white">
            {experienceType}
          </Badge>
          {availability && (
            <Badge 
              variant={availability === "Available Now" ? "default" : "secondary"}
              className={availability === "Available Now" ? "bg-primary text-primary-foreground" : ""}
            >
              {availability}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>
          {rating && (
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="font-medium">{rating}</span>
              {reviews && <span className="text-muted-foreground">({reviews})</span>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>

        <div className="pt-2">
          <span className="text-2xl font-bold text-foreground">${price.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground"> / trial stay</span>
        </div>
      </div>
    </div>
  );
};
