
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, ShoppingBag, ArrowRight, MapPin, Phone, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import { getOrderById } from "@/utils/orderUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OrderTrackingCard from "@/components/order/OrderTrackingCard";

const CheckoutSuccess = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [creatingProfile, setCreatingProfile] = useState(false);
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
          
          // Check if customer already has a profile
          if (details?.customer_email) {
            checkCustomerProfile(details.customer_email);
          }
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
  
  const checkCustomerProfile = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (error) throw error;
      setHasProfile(!!data);
    } catch (error) {
      console.error("Error checking customer profile:", error);
      // Default to false if error occurs
      setHasProfile(false);
    }
  };

  const createCustomerProfile = async () => {
    if (!orderDetails) return;
    
    try {
      setCreatingProfile(true);
      
      // Log the customer data we're about to insert
      console.log("Creating profile with data:", {
        name: orderDetails.customer_name,
        email: orderDetails.customer_email,
        phone: orderDetails.customer_phone,
        address: orderDetails.shipping_address,
        city: orderDetails.city,
        region: orderDetails.region,
      });
      
      // Use the supabase client's insert method as anon user
      const { data, error } = await supabase
        .from('customer_profiles')
        .insert({
          name: orderDetails.customer_name,
          email: orderDetails.customer_email,
          phone: orderDetails.customer_phone,
          address: orderDetails.shipping_address,
          city: orderDetails.city,
          region: orderDetails.region,
          status: 'active'
        })
        .select();
      
      if (error) {
        console.error("Supabase error creating profile:", error);
        throw error;
      }
      
      console.log("Profile created successfully:", data);
      toast.success("Customer profile created successfully");
      setHasProfile(true);
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast.error(`Failed to create profile: ${error.message}`);
    } finally {
      setCreatingProfile(false);
    }
  };

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
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-4 mb-4">
              <Clock className="h-12 w-12 text-primary" />
            </div>
            
            <h1 className="font-serif text-3xl font-medium mb-4">Mahadsanid!</h1>
            <h2 className="font-serif text-xl font-medium mb-4">Order Received!</h2>
            
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. We've received your order and it's currently awaiting admin approval. 
              You'll receive a confirmation SMS with your order reference once it's approved.
            </p>
          </div>
          
          {orderDetails && (
            <OrderTrackingCard 
              orderReference={generateOrderReference()}
              orderStatus={orderDetails.order_status || 'processing'}
              createdAt={orderDetails.created_at}
            />
          )}
          
          <div className="bg-primary/5 p-6 rounded-lg mb-8 text-left">
            <h2 className="font-medium mb-3 text-center">Order Information</h2>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Delivery Address:</p>
                  <p className="text-muted-foreground">
                    {orderDetails ? (
                      <>
                        {orderDetails.shipping_address}, {orderDetails.city}, {orderDetails.region}
                      </>
                    ) : (
                      'Not available'
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
          
          {hasProfile === false && !creatingProfile && (
            <div className="bg-amber-50 p-6 rounded-lg mb-8 text-center border border-amber-200">
              <h3 className="font-medium mb-2 text-amber-800">Create Your Customer Profile</h3>
              <p className="text-amber-700 mb-4 text-sm">
                Create a customer profile to make your next checkout faster and track your orders more easily.
              </p>
              <Button 
                onClick={createCustomerProfile}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Create Profile
              </Button>
            </div>
          )}
          
          {hasProfile === true && (
            <div className="bg-green-50 p-6 rounded-lg mb-8 text-center border border-green-200">
              <h3 className="font-medium mb-2 text-green-800">Customer Profile Active</h3>
              <p className="text-green-700 mb-4 text-sm">
                Your customer profile has been created. Future checkouts will be faster!
              </p>
            </div>
          )}
          
          {creatingProfile && (
            <div className="bg-blue-50 p-6 rounded-lg mb-8 text-center border border-blue-200">
              <div className="flex justify-center mb-3">
                <div className="animate-spin h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-blue-700 text-sm">Creating your customer profile...</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CheckoutSuccess;
