
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import BarwaqoLogo from "@/components/logo/BarwaqoLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { user, signOut, profile } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const navLinks = [
    { title: "Shop", path: "/shop" },
    { title: "Seasonal", path: "/seasonal" },
    { title: "Fruit Finder", path: "/fruit-finder" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" }
  ];

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
            className="flex items-center transition-all duration-300"
          >
            <BarwaqoLogo className={`h-8 ${scrolled ? 'w-28' : 'w-32'}`} />
          </Link>

          {!isMobile && (
            <nav className="mx-4 hidden flex-1 lg:flex">
              <ul className="flex space-x-8">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className={`text-foreground hover:text-gold transition-colors ${
                        location.pathname === link.path ? 'text-gold font-medium' : ''
                      }`}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {!isMobile && (
              <form onSubmit={handleSearch} className="relative w-56">
                <Input
                  type="text"
                  placeholder="Search fruits..."
                  className="pl-8 h-9 transition-all duration-300 focus:w-64 focus:border-gold border-gold/30 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            )}

            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative text-foreground hover:text-gold">
                <Heart className="h-5 w-5" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    {wishlistItems}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-foreground hover:text-gold">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-white">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-foreground hover:text-gold">
                    <User className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-green-500"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {profile?.customer_name || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="w-full cursor-pointer">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account?tab=orders" className="w-full cursor-pointer">
                      Order History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="text-foreground hover:text-gold">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Admin Login Link */}
            <Link to="/admin/login">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-gold">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin Login</span>
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

        {isMobile && mobileMenuOpen && (
          <div className="mt-4 animate-fade-in py-4 border-t border-border/50">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Input
                type="text"
                placeholder="Search fruits..."
                className="pl-8 w-full border-gold/30 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                <Search className="h-4 w-4" />
              </button>
            </form>

            <nav>
              <ul className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className={`block text-foreground hover:text-gold transition-colors ${
                        location.pathname === link.path ? 'text-gold font-medium' : ''
                      }`}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/wishlist" 
                    className={`block text-foreground hover:text-gold transition-colors ${
                      location.pathname === '/wishlist' ? 'text-gold font-medium' : ''
                    }`}
                  >
                    Wishlist
                  </Link>
                </li>
                <li>
                  {user ? (
                    <>
                      <Link 
                        to="/account" 
                        className={`block text-foreground hover:text-gold transition-colors ${
                          location.pathname === '/account' ? 'text-gold font-medium' : ''
                        }`}
                      >
                        My Account
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10 px-0"
                        onClick={signOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link 
                      to="/auth" 
                      className={`block text-foreground hover:text-gold transition-colors ${
                        location.pathname === '/auth' ? 'text-gold font-medium' : ''
                      }`}
                    >
                      Sign In / Register
                    </Link>
                  )}
                </li>
                {/* Admin Login Link for Mobile */}
                <li>
                  <Link 
                    to="/admin/login" 
                    className={`block text-foreground hover:text-gold transition-colors ${
                      location.pathname === '/admin/login' ? 'text-gold font-medium' : ''
                    }`}
                  >
                    <Shield className="h-4 w-4 inline mr-2" /> Admin Login
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
