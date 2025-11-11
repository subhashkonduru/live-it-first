import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Search, Menu, User } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold tracking-tight">
            Lovable
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink 
              to="/search" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Discover
            </NavLink>
            <NavLink 
              to="/how-it-works" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </NavLink>
            <NavLink 
              to="/host" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Become a Host
            </NavLink>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-3">
            <NavLink 
              to="/search" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Discover
            </NavLink>
            <NavLink 
              to="/how-it-works" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </NavLink>
            <NavLink 
              to="/host" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Become a Host
            </NavLink>
            <Button variant="outline" size="sm" className="w-full">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
