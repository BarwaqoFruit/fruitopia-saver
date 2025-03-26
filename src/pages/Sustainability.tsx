
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Leaf, Recycle, Truck, Droplet, LifeBuoy, Wind, Sun, Award } from "lucide-react";

const SustainabilitySection = ({ title, description, icon, imageUrl, isReversed = false }) => {
  return (
    <div className="py-16 border-b border-border/20 last:border-0">
      <div className={`grid gap-12 items-center ${isReversed ? 'lg:grid-cols-[1fr_1.2fr]' : 'lg:grid-cols-[1.2fr_1fr]'}`}>
        <div className={isReversed ? 'order-1 lg:order-2' : ''}>
          <div className="inline-flex items-center justify-center mb-6 bg-gold/10 p-3 rounded-full">
            {icon}
          </div>
          <h2 className="font-serif text-3xl font-medium mb-6">{title}</h2>
          <div className="w-16 h-1 bg-gold mb-8"></div>
          <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>
        </div>
        <div className={isReversed ? 'order-2 lg:order-1' : ''}>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src={imageUrl} alt={title} className="w-full h-auto object-cover aspect-[4/3]" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Sustainability = () => {
  const sections = [
    {
      title: "Organic Cultivation",
      description: "Our commitment to organic farming ensures that every fruit we offer is grown without synthetic pesticides, herbicides, or fertilizers. We work exclusively with farms that maintain rigorous organic certification, protecting both the environment and your health. This dedication to purity results in fruits with exceptional flavor profiles that truly represent nature's bounty.",
      icon: <Leaf className="w-8 h-8 text-gold" />,
      imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Water Conservation",
      description: "Water is precious. Our partner farms implement advanced irrigation techniques like drip systems and moisture sensors to minimize water usage while maximizing fruit quality. Through rainwater collection systems and greywater recycling, we ensure that every drop counts, reducing our water footprint by up to 60% compared to conventional farming practices.",
      icon: <Droplet className="w-8 h-8 text-gold" />,
      imageUrl: "https://images.unsplash.com/photo-1468421870903-4df1664ac249?q=80&w=1000&auto=format&fit=crop",
      isReversed: true
    },
    {
      title: "Carbon Neutral Operations",
      description: "From farm to table, we meticulously track and offset our carbon footprint. Our storage facilities utilize renewable energy, and our delivery fleet is transitioning to electric vehicles. What we cannot eliminate, we offset through investments in reforestation and clean energy projects, making your fruit purchase a climate-positive choice.",
      icon: <Wind className="w-8 h-8 text-gold" />,
      imageUrl: "https://images.unsplash.com/photo-1535241909546-3d80983aa754?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Eco-Friendly Packaging",
      description: "Luxury shouldn't come at the environment's expense. We've eliminated plastic from our packaging, using only biodegradable, compostable, or recyclable materials. Our signature boxes are crafted from sustainable bamboo and recycled paper, elegantly designed to minimize waste while maintaining the premium unboxing experience our clients expect.",
      icon: <Recycle className="w-8 h-8 text-gold" />,
      imageUrl: "https://images.unsplash.com/photo-1627485937980-221ea657c1c1?q=80&w=1000&auto=format&fit=crop",
      isReversed: true
    },
    {
      title: "Renewable Energy",
      description: "The sun that nourishes our fruits also powers our operations. We've installed solar panels at our distribution centers and encourage our farming partners to adopt renewable energy solutions. This commitment reduces our collective energy footprint and ensures that the only energy that goes into our fruits comes from clean, sustainable sources.",
      icon: <Sun className="w-8 h-8 text-gold" />,
      imageUrl: "https://images.unsplash.com/photo-1622978147823-33d5e241e976?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Fair Trade Practices",
      description: "True luxury includes ethical treatment of every person in our supply chain. We pay premium prices to our farmers, ensuring fair wages for all workers involved in bringing you exceptional fruits. By visiting our partner farms regularly and maintaining transparent relationships, we guarantee that social responsibility is woven into every aspect of our business.",
      icon: <Award className="w-8 h-8 text-gold" />,
      imageUrl: "https://images.unsplash.com/photo-1599594004136-37e9f9c65a59?q=80&w=1000&auto=format&fit=crop",
      isReversed: true
    }
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-marble-light bg-cover bg-fixed relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-6">Our Commitment to Sustainability</h1>
          <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Luxury and sustainability coexist at Barwaqo Fruit. We believe that the finest fruits should not only tantalize your taste buds but also respect our planet.
          </p>
        </div>
      </section>

      {/* Sustainability Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {sections.map((section, index) => (
            <SustainabilitySection 
              key={index}
              title={section.title}
              description={section.description}
              icon={section.icon}
              imageUrl={section.imageUrl}
              isReversed={section.isReversed}
            />
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl font-medium mb-4">Our Impact</h2>
            <div className="w-20 h-1 bg-gold mx-auto mb-6"></div>
            <p className="text-primary-foreground/80">
              Measurable results from our commitment to sustainable practices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-serif text-gold mb-4">60%</div>
              <p className="text-primary-foreground/80">Reduction in water usage through conservation techniques</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-serif text-gold mb-4">100%</div>
              <p className="text-primary-foreground/80">Renewable energy used in our processing facilities</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-serif text-gold mb-4">0</div>
              <p className="text-primary-foreground/80">Single-use plastics in our packaging materials</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl md:text-5xl font-serif text-gold mb-4">1.5M</div>
              <p className="text-primary-foreground/80">Trees planted through our carbon offset initiative</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Sustainability;
