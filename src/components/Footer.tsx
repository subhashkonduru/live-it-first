import { NavLink } from "./NavLink";
import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Lovable</h3>
            <p className="text-background/70 leading-relaxed">
              Redefining property discovery through immersive trial experiences. Live it before you commit.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Discover</h4>
            <ul className="space-y-3">
              <li>
                <NavLink to="/search" className="text-background/70 hover:text-background transition-colors">
                  Browse Experiences
                </NavLink>
              </li>
              <li>
                <NavLink to="/locations" className="text-background/70 hover:text-background transition-colors">
                  Popular Locations
                </NavLink>
              </li>
              <li>
                <NavLink to="/calendar" className="text-background/70 hover:text-background transition-colors">
                  Availability Calendar
                </NavLink>
              </li>
              <li>
                <NavLink to="/featured" className="text-background/70 hover:text-background transition-colors">
                  Featured Properties
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Host */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">For Hosts</h4>
            <ul className="space-y-3">
              <li>
                <NavLink to="/host" className="text-background/70 hover:text-background transition-colors">
                  List Your Property
                </NavLink>
              </li>
              <li>
                <NavLink to="/host-guide" className="text-background/70 hover:text-background transition-colors">
                  Host Guidelines
                </NavLink>
              </li>
              <li>
                <NavLink to="/pricing" className="text-background/70 hover:text-background transition-colors">
                  Pricing & Fees
                </NavLink>
              </li>
              <li>
                <NavLink to="/resources" className="text-background/70 hover:text-background transition-colors">
                  Resources
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Support</h4>
            <ul className="space-y-3">
              <li>
                <NavLink to="/help" className="text-background/70 hover:text-background transition-colors">
                  Help Center
                </NavLink>
              </li>
              <li>
                <NavLink to="/safety" className="text-background/70 hover:text-background transition-colors">
                  Safety & Trust
                </NavLink>
              </li>
              <li>
                <NavLink to="/terms" className="text-background/70 hover:text-background transition-colors">
                  Terms of Service
                </NavLink>
              </li>
              <li>
                <NavLink to="/privacy" className="text-background/70 hover:text-background transition-colors">
                  Privacy Policy
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/70 text-sm">
              © 2025 Lovable. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                English (US)
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                USD $
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
