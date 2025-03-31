
import React from "react";
import { ArrowRight, ShoppingBag, Truck, Package, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface OrderTrackingCardProps {
  orderReference: string;
  orderStatus: string;
  createdAt?: string;
}

const OrderTrackingCard = ({ orderReference, orderStatus, createdAt }: OrderTrackingCardProps) => {
  // Calculate the step based on order status
  const getStepFromStatus = (status: string): number => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const step = getStepFromStatus(orderStatus);
  
  // Format date if available
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Processing';

  console.log("Order status:", orderStatus, "Step:", step);

  return (
    <Card className="w-full mb-6">
      <CardHeader className="bg-primary/5 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Order Tracking</h3>
            <p className="text-sm text-muted-foreground">Reference: {orderReference}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-medium">{formattedDate}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-muted">
            <div 
              className={`h-full bg-primary transition-all duration-500 ${
                step === 0 ? 'bg-destructive' : ''
              }`}
              style={{ width: step === 0 ? '0%' : `${(step / 4) * 100}%` }}
            ></div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-4 relative z-10">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              } ${orderStatus.toLowerCase() === 'cancelled' && 'bg-destructive text-destructive-foreground'}`}>
                <ShoppingBag className="h-5 w-5" />
              </div>
              <p className="text-sm mt-2 text-center">Order Placed</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Package className="h-5 w-5" />
              </div>
              <p className="text-sm mt-2 text-center">Processing</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Truck className="h-5 w-5" />
              </div>
              <p className="text-sm mt-2 text-center">Shipped</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <CheckCircle className="h-5 w-5" />
              </div>
              <p className="text-sm mt-2 text-center">Delivered</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-muted/30 p-4 rounded-md">
          <p className="text-sm">
            <span className="font-medium">Current Status: </span>
            <span className={`${
              orderStatus.toLowerCase() === 'cancelled' 
                ? 'text-destructive font-medium' 
                : 'text-primary font-medium'
            }`}>
              {orderStatus.toLowerCase() === 'processing' && 'Order Processing'}
              {orderStatus.toLowerCase() === 'shipped' && 'Order Shipped'}
              {orderStatus.toLowerCase() === 'out_for_delivery' && 'Out for Delivery'}
              {orderStatus.toLowerCase() === 'completed' && 'Order Delivered'}
              {orderStatus.toLowerCase() === 'cancelled' && 'Order Cancelled'}
            </span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button asChild variant="outline" size="sm">
          <Link to="/shop">
            <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/">
            Return to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderTrackingCard;
