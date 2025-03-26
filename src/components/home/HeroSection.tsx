
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-secondary py-24 sm:py-32">
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury background" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-background"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-lg animate-fade-in">
            <h1 className="luxury-heading">
              Exquisite, <span className="text-gold">Premium</span> Fruits for Discerning Tastes
            </h1>
            <p className="mt-6 text-lg text-muted-foreground font-light">
              Experience nature's most perfect creations, hand-selected and delivered to elevate your culinary experiences.
            </p>
            <div className="mt-10 flex flex-wrap gap-6">
              <Button asChild size="lg" className="luxury-button-primary rounded-md">
                <Link to="/shop">
                  Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="luxury-button-outline">
                <Link to="/fruit-finder">
                  Discover Your Flavor
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-full shadow-xl animate-float">
              <img 
                src="https://images.unsplash.com/photo-1457296898342-cdd24585d095?q=80&w=1000&auto=format&fit=crop" 
                alt="Premium fruit arrangement" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-gold/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-4 -left-4 aspect-square w-40 overflow-hidden rounded-full bg-white shadow-lg animate-float" style={{ animationDelay: "1s" }}>
              <img 
                src="https://images.unsplash.com/photo-1587815073078-f636169821e3?q=80&w=500&auto=format&fit=crop" 
                alt="Exotic fruit" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent"></div>
            </div>
            <div className="absolute -right-6 top-1/4 aspect-square w-32 overflow-hidden rounded-full bg-white shadow-lg animate-float" style={{ animationDelay: "2s" }}>
              <img 
                src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=500&auto=format&fit=crop" 
                alt="Premium dragonfruit" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-gold/10 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
