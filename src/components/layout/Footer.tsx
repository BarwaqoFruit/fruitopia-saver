
import React from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Leaf, 
  Truck, 
  Heart 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-serif text-xl font-medium mb-4">Barwaqo Fruit</h3>
            <p className="text-muted-foreground mb-4">
              Premium organic and exotic fruits delivered to your doorstep. Fresh, sustainable, and delicious.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  All Fruits
                </Link>
              </li>
              <li>
                <Link to="/shop?category=organic" className="text-muted-foreground hover:text-primary transition-colors">
                  Organic
                </Link>
              </li>
              <li>
                <Link to="/shop?category=exotic" className="text-muted-foreground hover:text-primary transition-colors">
                  Exotic
                </Link>
              </li>
              <li>
                <Link to="/seasonal" className="text-muted-foreground hover:text-primary transition-colors">
                  Seasonal
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="text-muted-foreground hover:text-primary transition-colors">
                  Subscription Boxes
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Our Promise</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Leaf className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Sustainably sourced and eco-friendly packaging</span>
              </li>
              <li className="flex items-start">
                <Truck className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Fast delivery to ensure maximum freshness</span>
              </li>
              <li className="flex items-start">
                <Heart className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Hand-selected for quality and taste</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Barwaqo Fruit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
