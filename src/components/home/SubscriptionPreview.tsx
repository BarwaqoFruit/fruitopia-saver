
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

interface PlanProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const PlanCard = ({ title, price, description, features, isPopular }: PlanProps) => {
  return (
    <div className={`rounded-xl p-6 ${isPopular ? 'bg-primary/10 border-primary' : 'bg-white border-border'} border transition-all duration-300 hover:shadow-lg relative`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary px-4 py-1 rounded-full text-xs font-medium text-white">
            Most Popular
          </span>
        </div>
      )}
      
      <h3 className="font-serif text-xl font-medium">{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-3xl font-bold">${price}</span>
        <span className="ml-1 text-muted-foreground">/month</span>
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground">
        {description}
      </p>
      
      <ul className="mt-6 space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-8">
        <Button 
          asChild 
          variant={isPopular ? "default" : "outline"} 
          className="w-full"
        >
          <Link to="/subscription">
            Subscribe Now
          </Link>
        </Button>
      </div>
    </div>
  );
};

const SubscriptionPreview = () => {
  const plans = [
    {
      title: "Essential",
      price: 29.99,
      description: "Perfect for individuals looking for a weekly dose of freshness.",
      features: [
        "Weekly delivery",
        "5-7 seasonal fruits",
        "Free shipping",
        "Quality guarantee"
      ],
      isPopular: false
    },
    {
      title: "Family Box",
      price: 49.99,
      description: "Ideal for families who enjoy a variety of fresh fruits.",
      features: [
        "Weekly delivery",
        "10-12 seasonal fruits",
        "Includes exotic selections",
        "Free shipping",
        "Customize your box",
        "Quality guarantee"
      ],
      isPopular: true
    },
    {
      title: "Premium",
      price: 69.99,
      description: "The ultimate fruit experience with the finest selections.",
      features: [
        "Weekly delivery",
        "12-15 premium fruits",
        "Rare & exotic varieties",
        "Priority shipping",
        "Full customization",
        "Recipe cards included",
        "Quality guarantee"
      ],
      isPopular: false
    }
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl text-center mb-12">
          <h2 className="section-title">Subscription Boxes</h2>
          <p className="section-subtitle mt-4">
            Get fresh, seasonal fruits delivered to your doorstep on a regular schedule
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, idx) => (
            <PlanCard key={idx} {...plan} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/subscription" className="inline-flex items-center text-primary hover:underline font-medium">
            Learn more about our subscription options <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPreview;
