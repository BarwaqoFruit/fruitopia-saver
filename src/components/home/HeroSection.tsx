
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary to-background py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-lg animate-fade-in">
            <h1 className="font-serif text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
              Fresh, Organic, 
              <span className="text-primary"> Exceptional</span> Fruits
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Experience the finest selection of premium organic fruits and exotic produce, 
              delivered fresh to your doorstep.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/shop">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/fruit-finder">
                  Try Fruit Finder
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-full border-8 border-white shadow-xl animate-float">
              <img 
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1000&auto=format&fit=crop" 
                alt="Fresh fruits arrangement" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 aspect-square w-40 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg animate-float" style={{ animationDelay: "1s" }}>
              <img 
                src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=500&auto=format&fit=crop" 
                alt="Exotic dragonfruit" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -right-6 top-1/4 aspect-square w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg animate-float" style={{ animationDelay: "2s" }}>
              <img 
                src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?q=80&w=500&auto=format&fit=crop" 
                alt="Organic blueberries" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
