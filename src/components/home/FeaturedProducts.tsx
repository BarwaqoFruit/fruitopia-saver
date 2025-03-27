
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";

interface ProductProps {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  isOrganic: boolean;
  isNew: boolean;
  origin?: string;
}

const ProductCard = ({ id, name, category, price, rating, image, isOrganic, isNew, origin }: ProductProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image,
      quantity: 1,
      category
    });
  };

  return (
    <div className="luxury-product-card group">
      {/* Product Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isOrganic && (
          <Badge className="bg-primary text-primary-foreground px-3 py-1">Organic</Badge>
        )}
        {isNew && (
          <Badge className="bg-gold text-white px-3 py-1">New Arrival</Badge>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md">
          <Heart size={16} className="text-foreground" />
        </Button>
        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md" asChild>
          <Link to={`/product/${id}`}>
            <Eye size={16} className="text-foreground" />
          </Link>
        </Button>
      </div>
      
      {/* Product Image */}
      <div className="overflow-hidden rounded-md mb-5">
        <Link to={`/product/${id}`}>
          <img 
            src={image} 
            alt={name} 
            className="luxury-product-image aspect-square w-full object-cover"
          />
        </Link>
      </div>
      
      {/* Product Info */}
      <div className="space-y-2">
        <div className="text-sm text-gold font-medium uppercase tracking-wider">{category}</div>
        <h3 className="font-serif text-lg font-medium">
          <Link to={`/product/${id}`} className="hover:text-gold transition-colors">
            {name}
          </Link>
        </h3>
        
        {/* Origin if available */}
        {origin && (
          <div className="text-sm text-muted-foreground">Origin: {origin}</div>
        )}
        
        {/* Rating */}
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < rating ? "fill-gold text-gold" : "text-muted"} 
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">({rating.toFixed(1)})</span>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-3">
          <div className="font-serif text-lg">
            <span className="text-gold">${price.toFixed(2)}</span>
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

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      // This is a placeholder for fetching featured products from your API or database
      // You'll need to implement this based on your data source
      return [];
    }
  });

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">Curated Collection</h2>
          <div className="w-20 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-muted-foreground">
            Discover our premium selection of nature's finest treasures
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p>Error loading products. Please try again later.</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p>No featured products available at the moment.</p>
          </div>
        )}
        
        <div className="mt-16 text-center">
          <Button asChild variant="outline" size="lg" className="luxury-button-outline rounded-md px-8">
            <Link to="/shop">View Complete Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
