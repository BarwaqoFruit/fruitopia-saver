
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";

const CheckoutSuccess = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 mt-8">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-4 mb-4">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="font-serif text-3xl font-medium mb-4">Order Confirmed!</h1>
          
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. We've received your order and will begin
            processing it right away. You'll receive a confirmation email shortly.
          </p>
          
          <div className="bg-secondary p-6 rounded-lg mb-8">
            <h2 className="font-medium mb-2">Order Reference</h2>
            <p className="text-gold font-mono text-lg">ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
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
