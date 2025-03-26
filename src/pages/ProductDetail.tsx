
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Info, Leaf, Clock, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import PageLayout from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock database of products - in a real app, this would come from an API/database
const productsDatabase = [
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
    description: "Our premium avocados are sourced from sustainable farms in Mexico. They're rich, creamy, and perfect for guacamole, salads, or spreading on toast.",
    nutritionalInfo: {
      calories: "160 per 100g",
      fat: "15g",
      protein: "2g",
      carbs: "9g",
      vitamins: ["Vitamin K", "Folate", "Vitamin C", "Potassium", "Vitamin B6"]
    },
    storage: "Store at room temperature until ripe, then refrigerate for up to 3 days.",
    season: "Available year-round, peak season March through July"
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
    description: "Dragon fruit has a mildly sweet flavor reminiscent of a cross between a kiwi and a pear. The vibrant pink exterior houses a white or red flesh speckled with tiny black seeds that are rich in omega-3 and omega-9 fatty acids.",
    nutritionalInfo: {
      calories: "60 per 100g",
      fat: "0g",
      protein: "2g",
      carbs: "13g",
      vitamins: ["Vitamin C", "Iron", "Magnesium"]
    },
    storage: "Store at room temperature until ripe, then refrigerate for up to 5 days.",
    season: "Peak season summer through mid-fall"
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
    description: "These sweet, juicy organic strawberries are hand-picked at peak ripeness from our partner farms in California. They're perfect for snacking, desserts, or adding to your favorite smoothie.",
    nutritionalInfo: {
      calories: "32 per 100g",
      fat: "0.3g",
      protein: "0.7g",
      carbs: "7.7g",
      vitamins: ["Vitamin C", "Folate", "Potassium", "Manganese"]
    },
    storage: "Refrigerate immediately and consume within 2-3 days for best quality.",
    season: "Peak season April through June"
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
    description: "Our organic blueberries are packed with antioxidants and harvested at the perfect ripeness from Oregon's finest farms. Sweet, tangy, and incredibly nutritious.",
    nutritionalInfo: {
      calories: "57 per 100g",
      fat: "0.3g",
      protein: "0.7g",
      carbs: "14g",
      vitamins: ["Vitamin K", "Vitamin C", "Manganese"]
    },
    storage: "Refrigerate and consume within 1 week. Can be frozen for up to 6 months.",
    season: "Peak season June through August"
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
    description: "Passion fruit has an intense tropical flavor that's both sweet and tart. The aromatic pulp is filled with edible seeds and is perfect for desserts, cocktails, or eating fresh with a spoon.",
    nutritionalInfo: {
      calories: "97 per 100g",
      fat: "0.7g",
      protein: "2.2g",
      carbs: "23g",
      vitamins: ["Vitamin A", "Vitamin C", "Iron", "Potassium"]
    },
    storage: "Ripe passion fruits can be stored at room temperature for a few days or refrigerated for up to a week.",
    season: "Available year-round, peak season summer through fall"
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
    description: "Golden kiwi has a smooth, hairless skin and sweet, tropical flavor with notes of mango and pineapple. Less acidic than green kiwi, it's deliciously sweet and perfect for eating fresh.",
    nutritionalInfo: {
      calories: "63 per 100g",
      fat: "0.5g",
      protein: "1.1g",
      carbs: "15g",
      vitamins: ["Vitamin C", "Vitamin K", "Vitamin E", "Potassium", "Folate"]
    },
    storage: "Store at room temperature until ripe, then refrigerate for up to 7 days.",
    season: "Available year-round, peak season May through October"
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
    description: "These delicate organic raspberries are harvested at peak ripeness, offering a perfect balance of sweetness and tartness. Each berry bursts with flavor and is rich in antioxidants.",
    nutritionalInfo: {
      calories: "52 per 100g",
      fat: "0.7g",
      protein: "1.2g",
      carbs: "11.9g",
      vitamins: ["Vitamin C", "Manganese", "Vitamin K", "Magnesium"]
    },
    storage: "Refrigerate immediately and consume within 1-2 days for best quality.",
    season: "Peak season June through October"
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
    description: "Lychee has a delicate, floral sweetness with an exotic fragrance. The translucent white flesh is juicy and refreshing, with a texture similar to a firm grape. A true tropical delicacy.",
    nutritionalInfo: {
      calories: "66 per 100g",
      fat: "0.4g",
      protein: "0.8g",
      carbs: "16.5g",
      vitamins: ["Vitamin C", "Copper", "Potassium"]
    },
    storage: "Refrigerate and consume within 1 week. The peel may turn brown but the fruit inside remains good.",
    season: "Peak season May through July"
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = () => {
      setLoading(true);
      setTimeout(() => {
        const foundProduct = productsDatabase.find(p => p.id === Number(id));
        setProduct(foundProduct);
        setLoading(false);
      }, 500); // Simulate network delay
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        category: product.category
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    }
  };

  if (loading) {
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

  if (!product) {
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
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/shop" className="flex items-center text-muted-foreground hover:text-gold transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left column - Product image */}
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

          {/* Right column - Product details */}
          <div>
            <div className="space-y-4">
              {/* Category & Badges */}
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

              {/* Product name */}
              <h1 className="font-serif text-3xl md:text-4xl font-medium">{product.name}</h1>

              {/* Origin */}
              <p className="text-muted-foreground">Origin: {product.origin}</p>

              {/* Rating */}
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

              {/* Price */}
              <div className="mt-4">
                <span className="font-serif text-3xl text-gold">${product.price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground ml-2">/kg</span>
              </div>

              {/* Description */}
              <p className="text-foreground mt-4">{product.description}</p>

              {/* Quantity and Add to Cart */}
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

              {/* Product Features */}
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

            {/* Product Details Tabs */}
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
                    {product.nutritionalInfo.vitamins.map((vitamin: string, index: number) => (
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
