
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductProps {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  isOrganic: boolean;
  isNew: boolean;
}

const ProductCard = ({ id, name, category, price, rating, image, isOrganic, isNew }: ProductProps) => {
  return (
    <div className="product-card group">
      {/* Product Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isOrganic && (
          <Badge className="bg-primary">Organic</Badge>
        )}
        {isNew && (
          <Badge className="bg-accent text-white">New</Badge>
        )}
      </div>
      
      {/* Product Image */}
      <div className="product-image-container mb-4">
        <Link to={`/product/${id}`}>
          <img 
            src={image} 
            alt={name} 
            className="product-image aspect-square w-full rounded-md object-cover"
          />
        </Link>
      </div>
      
      {/* Product Info */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">{category}</div>
        <h3 className="font-medium">
          <Link to={`/product/${id}`} className="hover:text-primary transition-colors">
            {name}
          </Link>
        </h3>
        
        {/* Rating */}
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < rating ? "fill-accent text-accent" : "text-muted"} 
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">({rating.toFixed(1)})</span>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div className="font-medium">${price.toFixed(2)}<span className="text-xs text-muted-foreground ml-1">/kg</span></div>
          <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0">
            <ShoppingCart size={16} />
          </Button>
        </div>
      </div>
      
      {/* Quick Add - Appears on Hover */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-white p-4 shadow-md transition-transform duration-300 group-hover:translate-y-0">
        <Button className="w-full rounded-md">Add to Cart</Button>
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
      price: 4.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?q=80&w=600&auto=format&fit=crop",
      isOrganic: true,
      isNew: false
    },
    {
      id: 2,
      name: "Dragon Fruit",
      category: "Exotic",
      price: 7.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=600&auto=format&fit=crop",
      isOrganic: false,
      isNew: true
    },
    {
      id: 3,
      name: "Organic Strawberries",
      category: "Seasonal",
      price: 5.49,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=600&auto=format&fit=crop",
      isOrganic: true,
      isNew: false
    },
    {
      id: 4,
      name: "Fresh Blueberries",
      category: "Organic",
      price: 6.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?q=80&w=600&auto=format&fit=crop",
      isOrganic: true,
      isNew: false
    },
    {
      id: 5,
      name: "Passion Fruit",
      category: "Exotic",
      price: 8.49,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1604144894686-7e33f3a52667?q=80&w=600&auto=format&fit=crop",
      isOrganic: false,
      isNew: true
    },
    {
      id: 6,
      name: "Golden Kiwi",
      category: "Exotic",
      price: 4.99,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=600&auto=format&fit=crop",
      isOrganic: true,
      isNew: false
    },
    {
      id: 7,
      name: "Organic Raspberries",
      category: "Seasonal",
      price: 6.49,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1577069861033-54d656574adf?q=80&w=600&auto=format&fit=crop",
      isOrganic: true,
      isNew: false
    },
    {
      id: 8,
      name: "Lychee",
      category: "Exotic",
      price: 9.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1620429527435-2fcce63d3eb8?q=80&w=600&auto=format&fit=crop",
      isOrganic: false,
      isNew: true
    }
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl text-center mb-12">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle mt-4">
            Discover our selection of premium and seasonal fruits
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
