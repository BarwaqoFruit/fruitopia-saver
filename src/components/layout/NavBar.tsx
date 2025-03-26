
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md py-2 shadow-md"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center font-serif text-2xl font-medium transition-all duration-300"
          >
            <span className="text-gold mr-1">Barwaqo</span>
            <span>Fruit</span>
          </Link>

          {!isMobile && (
            <nav className="mx-4 hidden flex-1 lg:flex">
              <ul className="flex space-x-8">
                <li>
                  <Link 
                    to="/shop" 
                    className="text-foreground hover:text-gold transition-colors"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/seasonal" 
                    className="text-foreground hover:text-gold transition-colors"
                  >
                    Seasonal
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/fruit-finder" 
                    className="text-foreground hover:text-gold transition-colors"
                  >
                    Fruit Finder
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="text-foreground hover:text-gold transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-foreground hover:text-gold transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {!isMobile && (
              <div className="relative w-56">
                <Input
                  type="text"
                  placeholder="Search fruits..."
                  className="pl-8 h-9 transition-all duration-300 focus:w-64 focus:border-gold border-gold/30 bg-transparent"
                />
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            )}

            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-gold">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-foreground hover:text-gold">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-white">
                  0
                </span>
              </Button>
            </Link>

            <Link to="/account">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-gold">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground hover:text-gold"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-4 animate-fade-in py-4 border-t border-border/50">
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Search fruits..."
                className="pl-8 w-full border-gold/30 bg-transparent"
              />
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <nav>
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link 
                    to="/shop" 
                    className="block text-foreground hover:text-gold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/seasonal" 
                    className="block text-foreground hover:text-gold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Seasonal
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/fruit-finder" 
                    className="block text-foreground hover:text-gold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Fruit Finder
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="block text-foreground hover:text-gold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="block text-foreground hover:text-gold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
