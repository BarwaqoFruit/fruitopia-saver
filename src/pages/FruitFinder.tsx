
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Search, Filter, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const FruitFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [category, setCategory] = useState("all");

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 mt-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl font-medium mb-6 text-center">Fruit Finder</h1>
          <p className="text-muted-foreground mb-12 text-center">
            Find the perfect fruits based on your preferences, dietary needs, and taste profile.
          </p>
          
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border mb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search fruits..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="tropical">Tropical</SelectItem>
                    <SelectItem value="berries">Berries</SelectItem>
                    <SelectItem value="citrus">Citrus</SelectItem>
                    <SelectItem value="exotic">Exotic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="mt-2 md:mt-0">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-4">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
              <Slider
                defaultValue={[0, 20]}
                max={50}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mt-2"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" size="sm" className="text-xs">Low Sugar</Button>
              <Button variant="outline" size="sm" className="text-xs">High Vitamin C</Button>
              <Button variant="outline" size="sm" className="text-xs">Organic</Button>
              <Button variant="outline" size="sm" className="text-xs">Local</Button>
            </div>
          </div>
          
          <div className="text-center py-16 bg-secondary/50 rounded-lg">
            <Apple className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="font-serif text-2xl mb-4">Fruit finder coming soon!</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              We're working on enhancing your shopping experience. Use our shop page to browse our collection in the meantime.
            </p>
            <Button asChild size="lg">
              <a href="/shop">Browse Our Shop</a>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FruitFinder;
