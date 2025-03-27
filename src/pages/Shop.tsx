
import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ShoppingCart, Star, Heart, Filter, X, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Product type
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  isOrganic: boolean;
  isNew: boolean;
  origin?: string;
  tags: string[];
}

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: product.category
    });
  };

  return (
    <div className="luxury-product-card group">
      {/* Product Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isOrganic && (
          <Badge className="bg-primary text-primary-foreground px-3 py-1">Organic</Badge>
        )}
        {product.isNew && (
          <Badge className="bg-gold text-white px-3 py-1">New Arrival</Badge>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md">
          <Heart size={16} className="text-foreground" />
        </Button>
        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md" asChild>
          <Link to={`/product/${product.id}`}>
            <Eye size={16} className="text-foreground" />
          </Link>
        </Button>
      </div>
      
      {/* Product Image */}
      <div className="overflow-hidden rounded-md mb-5">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="luxury-product-image aspect-square w-full object-cover"
          />
        </Link>
      </div>
      
      {/* Product Info */}
      <div className="space-y-2">
        <div className="text-sm text-gold font-medium uppercase tracking-wider">{product.category}</div>
        <h3 className="font-serif text-lg font-medium">
          <Link to={`/product/${product.id}`} className="hover:text-gold transition-colors">
            {product.name}
          </Link>
        </h3>
        
        {/* Origin if available */}
        {product.origin && (
          <div className="text-sm text-muted-foreground">Origin: {product.origin}</div>
        )}
        
        {/* Rating */}
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < product.rating ? "fill-gold text-gold" : "text-muted"} 
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">({product.rating.toFixed(1)})</span>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-3">
          <div className="font-serif text-lg">
            <span className="text-gold">${product.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground ml-1">/kg</span>
          </div>
        </div>
      </div>
      
      {/* Quick Add - Appears on Hover */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-background/95 backdrop-blur-sm p-4 shadow-md transition-transform duration-300 group-hover:translate-y-0 border-t border-border/50">
        <Button 
          onClick={handleAddToCart}
          className="w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Add to Cart <ShoppingCart size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

const Shop = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 15]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from API or database
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // This is a placeholder for fetching real products from an API or database
      // You'll need to implement this based on your data source
      return [];
    }
  });

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Price range filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }

    // Search query
    if (
      searchQuery.trim() !== "" &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !(product.origin && product.origin.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }

    return true;
  });

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <PageLayout>
      {/* Shop Hero */}
      <section className="pt-32 pb-20 bg-marble-light bg-cover bg-fixed relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-6">Our Collection</h1>
          <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our curated selection of premium fruits sourced from the world's finest growing regions.
          </p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h2 className="font-serif text-2xl">Browse Products</h2>
              <p className="text-muted-foreground">
                {isLoading ? 'Loading products...' : 
                 error ? 'Error loading products' : 
                 `Showing ${filteredProducts.length} of ${products.length} products`}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative w-64">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 h-10 transition-all duration-300 border-gold/30 bg-transparent"
                />
              </div>
              
              <Button
                variant="outline"
                className="lg:hidden flex items-center"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <Filter size={16} className="mr-2" /> Filters
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Filters - Desktop */}
            <div className="hidden lg:block">
              <div className="border border-border/50 rounded-lg p-6 sticky top-24">
                <h3 className="font-serif text-lg font-medium mb-6">Filters</h3>
                
                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="text-base font-medium mb-4">Price Range</h4>
                  <Slider
                    defaultValue={[0, 15]}
                    max={15}
                    step={0.5}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <span>${priceRange[0].toFixed(2)}</span>
                    <span>${priceRange[1].toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Categories */}
                <div className="mb-8">
                  <h4 className="text-base font-medium mb-4">Categories</h4>
                  <div className="space-y-3">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category}`} 
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-base cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reset Filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setPriceRange([0, 15]);
                    setSelectedCategories([]);
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* Filters - Mobile */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 p-6 lg:hidden overflow-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-xl font-medium">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X size={24} />
                  </Button>
                </div>
                
                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="text-base font-medium mb-4">Price Range</h4>
                  <Slider
                    defaultValue={[0, 15]}
                    max={15}
                    step={0.5}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <span>${priceRange[0].toFixed(2)}</span>
                    <span>${priceRange[1].toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Categories */}
                <div className="mb-8">
                  <h4 className="text-base font-medium mb-4">Categories</h4>
                  <div className="space-y-3">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-mobile-${category}`} 
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label htmlFor={`category-mobile-${category}`} className="text-base cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Apply and Reset */}
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setPriceRange([0, 15]);
                      setSelectedCategories([]);
                      setSearchQuery("");
                    }}
                  >
                    Reset
                  </Button>
                  <Button 
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
            
            {/* Products Grid */}
            <div>
              {isLoading ? (
                <div className="text-center py-16">
                  <h3 className="font-serif text-xl mb-4">Loading Products...</h3>
                  <p className="text-muted-foreground">Please wait while we fetch the products.</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <h3 className="font-serif text-xl mb-4">Error Loading Products</h3>
                  <p className="text-muted-foreground mb-8">There was an error fetching the products. Please try again later.</p>
                  <Button variant="outline">Retry</Button>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="font-serif text-xl mb-4">No Products Found</h3>
                  <p className="text-muted-foreground mb-8">
                    {products.length === 0 
                      ? "No products have been added to the store yet."
                      : "Try adjusting your filters or search query."}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPriceRange([0, 15]);
                      setSelectedCategories([]);
                      setSearchQuery("");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Shop;
