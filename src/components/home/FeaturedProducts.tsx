
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Product, fetchFeaturedProducts } from "@/utils/productUtils";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: product.category
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <div className="luxury-product-card group relative">
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
            className="luxury-product-image aspect-square w-full object-cover transition-all duration-500 hover:scale-105"
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

const FeaturedProducts = () => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeaturedProducts
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
              <ProductCard key={product.id} product={product} />
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
