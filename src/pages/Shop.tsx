
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ShoppingCart, Star, Heart, Filter, X, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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

// Mock product data
const products: Product[] = [
  {
    id: 1,
    name: "Premium Avocado",
    category: "Organic",
    price: 6.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551460188-2456b57a5470?q=80&w=600&auto=format&fit=crop",
    isOrganic: true,
    isNew: false,
    origin: "Mexico",
    tags: ["organic", "popular", "healthy"]
  },
  {
    id: 2,
    name: "Dragon Fruit",
    category: "Exotic",
    price: 9.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=600&auto=format&fit=crop",
    isOrganic: false,
    isNew: true,
    origin: "Vietnam",
    tags: ["exotic", "rare", "superfood"]
  },
  {
    id: 3,
    name: "Organic Strawberries",
    category: "Premium",
    price: 7.49,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?q=80&w=600&auto=format&fit=crop",
    isOrganic: true,
    isNew: false,
    origin: "California",
    tags: ["organic", "seasonal", "antioxidant"]
  },
  {
    id: 4,
    name: "Fresh Blueberries",
    category: "Organic",
    price: 8.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1592154014823-eb3e127b44dd?q=80&w=600&auto=format&fit=crop",
    isOrganic: true,
    isNew: false,
    origin: "Oregon",
    tags: ["organic", "superfood", "antioxidant"]
  },
  {
    id: 5,
    name: "Passion Fruit",
    category: "Exotic",
    price: 10.49,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1604144894686-7e33f3a52667?q=80&w=600&auto=format&fit=crop",
    isOrganic: false,
    isNew: true,
    origin: "Brazil",
    tags: ["exotic", "tropical", "rare"]
  },
  {
    id: 6,
    name: "Golden Kiwi",
    category: "Exotic",
    price: 7.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=600&auto=format&fit=crop",
    isOrganic: true,
    isNew: false,
    origin: "New Zealand",
    tags: ["organic", "vitamin-c", "superfood"]
  },
  {
    id: 7,
    name: "Organic Raspberries",
    category: "Premium",
    price: 9.49,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1577069861033-54d656574adf?q=80&w=600&auto=format&fit=crop",
    isOrganic: true,
    isNew: false,
    origin: "Washington",
    tags: ["organic", "seasonal", "antioxidant"]
  },
  {
    id: 8,
    name: "Lychee",
    category: "Exotic",
    price: 12.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1620429527435-2fcce63d3eb8?q=80&w=600&auto=format&fit=crop",
    isOrganic: false,
    isNew: true,
    origin: "Thailand",
    tags: ["exotic", "tropical", "seasonal"]
  },
  {
    id: 9,
    name: "Mango",
    category: "Tropical",
    price: 5.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop",
    isOrganic: false,
    isNew: false,
    origin: "India",
    tags: ["tropical", "popular", "vitamin-a"]
  },
  {
    id: 10,
    name: "Pink Lady Apple",
    category: "Classic",
    price: 3.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1606757389723-23c4e4c2bcdb?q=80&w=600&auto=format&fit=crop",
    isOrganic: true,
    isNew: false,
    origin: "Washington",
    tags: ["organic", "everyday", "fiber"]
  },
  {
    id: 11,
    name: "Blood Orange",
    category: "Specialty",
    price: 7.49,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1597714026720-8f74c62310ba?q=80&w=600&auto=format&fit=crop",
    isOrganic: true,
    isNew: true,
    origin: "Sicily",
    tags: ["organic", "specialty", "vitamin-c"]
  },
  {
    id: 12,
    name: "Pineapple",
    category: "Tropical",
    price: 8.99,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?q=80&w=600&auto=format&fit=crop",
    isOrganic: false,
    isNew: false,
    origin: "Costa Rica",
    tags: ["tropical", "enzyme", "vitamin-c"]
  }
];

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
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
        <Button className="w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
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
              <p className="text-muted-foreground">Showing {filteredProducts.length} of {products.length} products</p>
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
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="font-serif text-xl mb-4">No Products Found</h3>
                  <p className="text-muted-foreground mb-8">Try adjusting your filters or search query.</p>
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
