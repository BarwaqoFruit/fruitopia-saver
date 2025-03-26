
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1522184216316-3c1a2f3f8346?q=80&w=2000&auto=format&fit=crop" 
          alt="Premium fruits background" 
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-gold/30"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-medium mb-8">
            Elevate Your Experience
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            Join our distinguished clientele who appreciate nature's finest offerings. 
            Indulge in exceptional flavors that transform ordinary moments into extraordinary experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button asChild size="lg" className="luxury-button-primary rounded-md px-8 py-6">
              <Link to="/shop">
                Shop Our Collection <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="luxury-button-outline rounded-md px-8 py-6">
              <Link to="/about">
                Our Commitment to Excellence
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
