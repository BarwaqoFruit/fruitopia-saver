
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Leaf } from "lucide-react";

const Seasonal = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl font-medium mb-6">Seasonal Fruits</h1>
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full bg-primary/10">
              <Leaf className="h-12 w-12 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground mb-8">
            Discover the freshest produce of the season. Our seasonal collection changes throughout the year to bring you the best nature has to offer at its peak freshness and flavor.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <h2 className="font-serif text-2xl mb-4">Current Season: Summer</h2>
              <p className="text-muted-foreground mb-4">
                Enjoy the vibrant flavors of summer with our handpicked selection of seasonal fruits. These delicious treats are at their peak right now!
              </p>
              <ul className="space-y-2 text-left">
                <li>✓ Watermelon</li>
                <li>✓ Peaches</li>
                <li>✓ Cherries</li>
                <li>✓ Berries</li>
                <li>✓ Mangoes</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <h2 className="font-serif text-2xl mb-4">Coming Soon: Fall</h2>
              <p className="text-muted-foreground mb-4">
                Get ready for the upcoming season with these autumn favorites that will be available soon in our collection.
              </p>
              <ul className="space-y-2 text-left">
                <li>• Apples</li>
                <li>• Pears</li>
                <li>• Grapes</li>
                <li>• Figs</li>
                <li>• Pomegranates</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-left">
            <h2 className="font-serif text-2xl mb-4">Why Choose Seasonal?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Better Taste</h3>
                <p>Fruits harvested in season have developed their full flavor profile.</p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Higher Nutrition</h3>
                <p>Seasonal produce contains more nutrients as they're picked at peak ripeness.</p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Eco-Friendly</h3>
                <p>Seasonal eating reduces the carbon footprint associated with long-distance transportation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Seasonal;
