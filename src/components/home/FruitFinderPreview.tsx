
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FruitFinderPreview = () => {
  const [query, setQuery] = useState("");
  
  const suggestions = [
    "sweet and juicy",
    "tropical flavor",
    "crisp texture",
    "high in vitamin C",
    "low sugar content"
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="glass rounded-3xl bg-white/70 shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16">
              <h2 className="font-serif text-3xl font-medium">
                Discover Your Perfect Fruit
              </h2>
              <p className="mt-4 text-muted-foreground">
                Describe the taste, texture, or nutrients you're looking for, and 
                we'll find the perfect fruits to match.
              </p>
              
              <div className="mt-8">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="E.g., sweet and juicy, or high in vitamin C..."
                    className="pl-4 pr-10 py-6 text-base shadow-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <Button 
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 p-0"
                      onClick={() => setQuery("")}
                    >
                      <span className="sr-only">Clear</span>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    </Button>
                  )}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  asChild
                  className="mt-6 rounded-full"
                >
                  <Link to={`/fruit-finder${query ? `?q=${encodeURIComponent(query)}` : ''}`}>
                    Find My Fruit <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent"></div>
              <img 
                src="https://images.unsplash.com/photo-1519996529931-28324d5a630e?q=80&w=800&auto=format&fit=crop" 
                alt="Fruit variety" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FruitFinderPreview;
