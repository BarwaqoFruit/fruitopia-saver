
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import PageLayout from "@/components/layout/PageLayout";

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      category: item.category
    });
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-medium">My Wishlist</h1>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearWishlist} className="text-sm">
              <Trash2 className="h-4 w-4 mr-2" /> Clear Wishlist
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-secondary/50 rounded-lg">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="font-serif text-2xl mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Add items you love to your wishlist. Review them anytime and easily move them to your cart.
            </p>
            <Button asChild size="lg">
              <Link to="/shop">
                Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="group border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-all duration-300">
                <div className="relative aspect-square">
                  <Link to={`/product/${item.id}`}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <Button 
                    onClick={() => removeItem(item.id)} 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">{item.category}</div>
                  <h3 className="font-serif text-lg font-medium mb-2">
                    <Link to={`/product/${item.id}`} className="hover:text-gold transition-colors">
                      {item.name}
                    </Link>
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="font-serif text-lg text-gold">${item.price.toFixed(2)}</div>
                    <Button onClick={() => handleAddToCart(item)} size="sm" className="bg-primary hover:bg-primary/90">
                      <ShoppingCart className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Wishlist;
