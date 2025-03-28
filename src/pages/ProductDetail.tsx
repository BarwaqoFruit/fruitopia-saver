
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Leaf, Clock, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import PageLayout from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/utils/productUtils";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id
  });

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id, // This is now a string matching the Product interface
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        category: product.category
      });
      
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 mt-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-slate-200 h-16 w-16"></div>
              <div className="mt-4 text-lg text-muted-foreground">Loading product details...</div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !product) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 mt-8">
          <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/shop">Return to Shop</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 mt-8">
        <div className="mb-8">
          <Link to="/shop" className="flex items-center text-muted-foreground hover:text-gold transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="rounded-xl overflow-hidden border border-border mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full object-cover aspect-square transition-all duration-500 hover:scale-105"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm">
                <Share2 size={16} className="mr-2" /> Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart size={16} className="mr-2" /> Add to Wishlist
              </Button>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div className="flex items-center mb-2 space-x-2">
                <Badge className="text-xs bg-secondary text-foreground px-3 py-1">
                  {product.category}
                </Badge>
                {product.isOrganic && (
                  <Badge className="text-xs bg-primary text-primary-foreground px-3 py-1">
                    Organic
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="text-xs bg-gold text-white px-3 py-1">
                    New Arrival
                  </Badge>
                )}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-medium">{product.name}</h1>

              {product.origin && (
                <p className="text-muted-foreground">Origin: {product.origin}</p>
              )}

              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-muted"}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">({product.rating.toFixed(1)})</span>
              </div>

              <div className="mt-4">
                <span className="font-serif text-3xl text-gold">${product.price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground ml-2">/kg</span>
              </div>

              <p className="text-foreground mt-4">{product.description}</p>

              <div className="flex items-center gap-4 mt-8">
                <div className="flex items-center border border-border rounded-md">
                  <button
                    className="p-3 border-r border-border text-foreground hover:bg-secondary transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <div className="px-6 py-3 font-medium">{quantity}</div>
                  <button
                    className="p-3 border-l border-border text-foreground hover:bg-secondary transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </Button>
              </div>

              {added && (
                <Alert className="bg-primary/10 text-primary">
                  <AlertDescription>
                    Product added to your cart!
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5 text-primary" />
                  <span className="text-sm">
                    {product.isOrganic ? "Organic Certified" : "Conventionally Grown"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gold" />
                  <span className="text-sm">Fast Delivery</span>
                </div>
                <div className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  <span className="text-sm">Quality Guarantee</span>
                </div>
                <div className="flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-gold" />
                  <span className="text-sm">Free Shipping over $50</span>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <Tabs defaultValue="nutritional">
              <TabsList className="mb-4">
                <TabsTrigger value="nutritional">Nutritional Info</TabsTrigger>
                <TabsTrigger value="storage">Storage Tips</TabsTrigger>
                <TabsTrigger value="season">Seasonality</TabsTrigger>
              </TabsList>
              <TabsContent value="nutritional" className="space-y-4">
                <h4 className="font-medium">Nutritional Information</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Calories:</span>
                    <span>{product.nutritionalInfo.calories}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Fat:</span>
                    <span>{product.nutritionalInfo.fat}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Protein:</span>
                    <span>{product.nutritionalInfo.protein}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Carbohydrates:</span>
                    <span>{product.nutritionalInfo.carbs}</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Key Vitamins & Minerals:</h5>
                  <div className="flex flex-wrap gap-2">
                    {product.nutritionalInfo.vitamins.map((vitamin, index) => (
                      <Badge key={index} variant="outline">
                        {vitamin}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="storage">
                <h4 className="font-medium mb-2">Storage Tips</h4>
                <p>{product.storage}</p>
              </TabsContent>
              <TabsContent value="season">
                <h4 className="font-medium mb-2">Seasonality</h4>
                <p>{product.season}</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetail;
