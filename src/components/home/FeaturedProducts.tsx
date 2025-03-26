
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

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
  const products = [
    {
      id: 1,
      name: "Premium Avocado",
      category: "Organic",
      price: 6.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1551460188-2456b57a5470?q=80&w=600&auto=format&fit=crop",
      isOrganic: true,
      isNew: false,
      origin: "Mexico"
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
      origin: "Vietnam"
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
      origin: "California"
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
      origin: "Oregon"
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
      origin: "Brazil"
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
      origin: "New Zealand"
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
      origin: "Washington"
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
      origin: "Thailand"
    }
  ];

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
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
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
