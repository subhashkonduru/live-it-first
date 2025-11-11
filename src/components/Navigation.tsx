import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Search, Menu, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold tracking-tight gradient-logo">
            Live It First
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
            <Link to="/host">
              <Button size="sm" className="cta-glow">Become a Host</Button>
            </Link>
            {token && (
              <>
                <NavLink to="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">My Account</NavLink>
                {userRole === 'admin' && <NavLink to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Admin</NavLink>}
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            {!token ? (
              <Link to="/login" className="hidden md:inline-block">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/profile" className="text-sm">Profile</NavLink>
                <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('userId'); localStorage.removeItem('userRole'); location.href = '/'; }}>Logout</Button>
              </div>
            )}
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
            <Link to="/login" className="w-full block">
              <Button variant="outline" size="sm" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <NavLink 
              to="/register" 
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};
