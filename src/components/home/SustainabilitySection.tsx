
import React from "react";
import { Leaf, Droplet, Sun, Wind } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SustainabilityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SustainabilityCard = ({ icon, title, description }: SustainabilityCardProps) => {
  return (
    <div className="bg-secondary/70 backdrop-blur-sm p-8 rounded-lg border border-border/50 transition-all duration-300 hover:shadow-lg">
      <div className="bg-gold/10 p-4 rounded-full inline-flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-medium mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const SustainabilitySection = () => {
  const practices = [
    {
      icon: <Leaf className="h-8 w-8 text-gold" />,
      title: "Organic Farming",
      description: "We partner exclusively with farms that maintain organic certification, ensuring our fruits are free from harmful pesticides and chemicals."
    },
    {
      icon: <Droplet className="h-8 w-8 text-gold" />,
      title: "Water Conservation",
      description: "Our farming partners implement advanced water conservation techniques, reducing water usage while maintaining exceptional fruit quality."
    },
    {
      icon: <Wind className="h-8 w-8 text-gold" />,
      title: "Carbon Neutral",
      description: "From farm to doorstep, we offset our carbon footprint through strategic partnerships with environmental conservation organizations."
    },
    {
      icon: <Sun className="h-8 w-8 text-gold" />,
      title: "Renewable Energy",
      description: "Solar-powered facilities and energy-efficient transportation systems minimize environmental impact throughout our supply chain."
    }
  ];

  return (
    <section className="py-24 bg-marble-light bg-fixed bg-cover relative">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-xl text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">Sustainable Luxury</h2>
          <div className="w-20 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-muted-foreground">
            Our commitment to environmental stewardship enhances the quality and exclusivity of our offerings
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {practices.map((practice, idx) => (
            <SustainabilityCard key={idx} {...practice} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button asChild variant="outline" className="luxury-button-outline rounded-md px-8">
            <Link to="/sustainability">Learn More About Our Practices</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
