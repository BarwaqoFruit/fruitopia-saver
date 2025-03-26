
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <ShoppingBag size={64} className="text-muted-foreground" />
            </div>
            <h1 className="font-serif text-3xl mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any premium fruits to your cart yet.
            </p>
            <Button asChild className="bg-primary text-primary-foreground px-8 py-6 rounded-md">
              <Link to="/shop">
                Explore Our Collection <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="pt-32 pb-16 bg-marble-light bg-cover bg-fixed relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium mb-6">Your Cart</h1>
          <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="border-b border-border pb-4 mb-8">
                <h2 className="font-serif text-2xl">Items ({totalItems})</h2>
              </div>

              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b border-border/50 pb-8">
                    <div className="w-full sm:w-32 h-32 rounded-md overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-serif text-xl mb-1">{item.name}</h3>
                          <div className="text-sm text-gold font-medium">{item.category}</div>
                        </div>
                        <div className="font-serif text-xl text-gold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-6">
                        ${item.price.toFixed(2)}/kg
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 rounded-none"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 rounded-none"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={16} className="mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="text-muted-foreground"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border/50 rounded-lg p-8 sticky top-24">
                <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="border-t border-border/50 pt-4 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-serif text-xl text-gold">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  asChild
                  className="w-full py-6 bg-primary text-primary-foreground rounded-md"
                >
                  <Link to="/checkout">
                    Proceed to Checkout <ArrowRight className="ml-1" size={16} />
                  </Link>
                </Button>
                
                <div className="mt-6">
                  <Button 
                    asChild
                    variant="outline" 
                    className="w-full"
                  >
                    <Link to="/shop">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Cart;
