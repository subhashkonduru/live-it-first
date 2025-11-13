import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Search, Menu, User } from "@/lib/lucide-stub";
import { useState } from "react";
import { Link } from "react-router-dom";
import { mainMenu, quickLinks } from '@/lib/menu';

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="text-2xl md:text-3xl font-bold tracking-tight gradient-logo brand-glow">
            Live It First
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {mainMenu.map((m) => (
              m.label === 'Become a Host' ? (
                <Link key={m.to} to={m.to}>
                  <Button variant="gold" size="sm" className="cta-glow">{m.label}</Button>
                </Link>
              ) : (
                <NavLink key={m.to} to={m.to} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{m.label}</NavLink>
              )
            ))}
            {token && (
              <>
                <NavLink to="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">My Account</NavLink>
                {userRole === 'admin' && <NavLink to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Admin</NavLink>}
              </>
            )}
            {/* Quick links dropdown (desktop) */}
            <div className="relative group">
              <Button variant="ghost" size="sm" className="btn-ghost-hover-contrast">More</Button>
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none group-hover:pointer-events-auto absolute right-0 mt-2 w-56 bg-card text-card-foreground rounded-lg shadow-lg p-3 z-50">
                <div className="grid gap-2">
                  {quickLinks.slice(0,6).map(q => (
                    <Button asChild key={q.to} variant="ghost" size="default" className="justify-start w-full">
                      <Link to={q.to}>{q.label}</Link>
                    </Button>
                  ))}
                  <div className="border-t border-border mt-2 pt-2">
                    <Button asChild variant="ghost" size="sm" className="justify-start w-full">
                      <Link to="/search">All links</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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
            {mainMenu.map((m) => (
              m.label === 'Become a Host' ? (
                <Link key={m.to} to={m.to} className="w-full block">
                  <Button variant="gold" size="sm" className="w-full">{m.label}</Button>
                </Link>
              ) : (
                <NavLink key={m.to} to={m.to} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{m.label}</NavLink>
              )
            ))}
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
