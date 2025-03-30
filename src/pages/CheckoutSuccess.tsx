
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, ShoppingBag, ArrowRight, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import { getOrderById } from "@/utils/orderUtils";

const CheckoutSuccess = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Check if order ID is in the URL query params
    const params = new URLSearchParams(location.search);
    const id = params.get('order_id');
    if (id) {
      setOrderId(id);
      
      // Fetch order details
      const fetchOrderDetails = async () => {
        try {
          setIsLoading(true);
          const details = await getOrderById(id);
          setOrderDetails(details);
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchOrderDetails();
    } else {
      setIsLoading(false);
    }
  }, [location]);

  // Generate a unique Somali-style order reference
  const generateOrderReference = () => {
    if (orderId) {
      // Use the first 8 characters of the order ID
      const shortId = orderId.slice(0, 8);
      return `BRW-${shortId}`;
    }
    
    // Fallback if no order ID
    const prefix = "BRW";
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${timestamp}-${random}`;
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 mt-8 flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 mt-8">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-4 mb-4">
            <Clock className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="font-serif text-3xl font-medium mb-4">Mahadsanid!</h1>
          <h2 className="font-serif text-xl font-medium mb-4">Order Received!</h2>
          
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. We've received your order and it's currently awaiting admin approval. 
            You'll receive a confirmation SMS with your order reference once it's approved.
          </p>
          
          {orderDetails && orderDetails.order_status === 'completed' && (
            <div className="bg-secondary p-6 rounded-lg mb-8">
              <h2 className="font-medium mb-2">Order Reference</h2>
              <p className="text-gold font-mono text-lg">{generateOrderReference()}</p>
            </div>
          )}
          
          <div className="bg-primary/5 p-6 rounded-lg mb-8 text-left">
            <h2 className="font-medium mb-3 text-center">Order Information</h2>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Your order status:</p>
                  <p className="text-muted-foreground">
                    {orderDetails ? (
                      <span className={`font-medium ${
                        orderDetails.order_status === 'completed' 
                          ? 'text-green-600' 
                          : orderDetails.order_status === 'cancelled' 
                            ? 'text-red-600' 
                            : 'text-amber-600'
                      }`}>
                        {orderDetails.order_status === 'completed' 
                          ? 'Approved' 
                          : orderDetails.order_status === 'cancelled' 
                            ? 'Cancelled' 
                            : 'Awaiting approval'}
                      </span>
                    ) : (
                      'Awaiting processing'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Expected delivery after approval:</p>
                  <p className="text-muted-foreground">1-2 business days for Mogadishu</p>
                  <p className="text-muted-foreground">2-4 business days for other regions</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Need help with your order?</p>
                  <p className="text-muted-foreground">Call us at 252-61-BARWAQO (252-61-227-9276)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
              </Link>
            </Button>
            
            <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
              <Link to="/">
                Return to Home <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CheckoutSuccess;
