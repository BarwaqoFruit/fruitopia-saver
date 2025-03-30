
import React from "react";
import { Link } from "react-router-dom";
import { 
  Instagram, 
  Twitter, 
  Leaf, 
  Truck, 
  Heart,
  Mail,
  MapPin,
  Phone,
  Facebook
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = React.useState("");
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      toast.success("Thank you for subscribing!", {
        description: "You've been added to our newsletter."
      });
      setEmail("");
    } else {
      toast.error("Please enter a valid email address");
    }
  };
  
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-primary-foreground/10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-serif text-2xl md:text-3xl mb-4">Join Our Exclusive Circle</h3>
            <p className="text-primary-foreground/80 mb-8">
              Subscribe to receive updates on new arrivals, special offers, and seasonal delicacies.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input 
                type="email" 
                placeholder="Your Email Address" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-gold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-gold hover:bg-gold/90 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 py-16">
          <div>
            <h3 className="font-serif text-xl font-medium mb-6">Barwaqo Fruit</h3>
            <p className="text-primary-foreground/80 mb-6">
              Purveyors of the world's finest fruits, hand-selected and delivered to elevate your culinary experience.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-medium mb-6">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/shop" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/shop?category=organic" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Organic Selection
                </Link>
              </li>
              <li>
                <Link to="/shop?category=exotic" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Exotic Varieties
                </Link>
              </li>
              <li>
                <Link to="/seasonal" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Seasonal Offerings
                </Link>
              </li>
              <li>
                <Link to="/fruit-finder" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Fruit Finder
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-medium mb-6">Customer Care</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-medium mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-gold flex-shrink-0" />
                <span className="text-primary-foreground/80">Makka Al-Mukarama Road, Mogadishu, Somalia</span>
              </li>
              <li className="flex items-start">
                <Phone className="mr-3 h-5 w-5 text-gold flex-shrink-0" />
                <span className="text-primary-foreground/80">+252 61 227 9276</span>
              </li>
              <li className="flex items-start">
                <Mail className="mr-3 h-5 w-5 text-gold flex-shrink-0" />
                <a href="mailto:info@barwaqofruit.com" className="text-primary-foreground/80 hover:text-gold transition-colors">
                  info@barwaqofruit.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Our Promise Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-primary-foreground/10">
          <div className="flex items-start">
            <Leaf className="mr-4 h-6 w-6 text-gold flex-shrink-0" />
            <div>
              <h4 className="font-serif text-base font-medium mb-2">Sustainably Sourced</h4>
              <p className="text-primary-foreground/70 text-sm">
                Each fruit is ethically sourced from partner farms committed to sustainable practices.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Truck className="mr-4 h-6 w-6 text-gold flex-shrink-0" />
            <div>
              <h4 className="font-serif text-base font-medium mb-2">Premium Delivery</h4>
              <p className="text-primary-foreground/70 text-sm">
                Climate-controlled delivery ensures your fruits arrive at the peak of freshness.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Heart className="mr-4 h-6 w-6 text-gold flex-shrink-0" />
            <div>
              <h4 className="font-serif text-base font-medium mb-2">Expert Curation</h4>
              <p className="text-primary-foreground/70 text-sm">
                Every fruit is hand-selected by our expert team for exceptional taste and quality.
              </p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="py-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Barwaqo Fruit. All rights reserved. A mark of luxury and excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
