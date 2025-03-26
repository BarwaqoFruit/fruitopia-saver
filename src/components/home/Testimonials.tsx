
import React from "react";
import { Star } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

const TestimonialCard = ({ name, role, content, rating, image }: TestimonialProps) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "fill-accent text-accent" : "text-muted"} 
          />
        ))}
      </div>
      
      <blockquote className="mb-6 text-foreground">
        "{content}"
      </blockquote>
      
      <div className="flex items-center">
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>
        <div className="ml-3">
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Monthly Subscriber",
      content: "The quality of fruits I receive in my monthly box is exceptional. Everything is always fresh and the variety keeps me excited every month!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "Regular Customer",
      content: "The Fruit Finder feature helped me discover fruits I never knew existed. I've become much more adventurous with my fruit choices.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Emily Rodriguez",
      role: "Family Box Subscriber",
      content: "My family loves our weekly fruit box. The kids get excited every time it arrives, and it's helped them develop healthier eating habits.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "David Thompson",
      role: "Premium Box Subscriber",
      content: "The exotic selections in the Premium box have exceeded my expectations. Worth every penny for the quality and uniqueness of the fruits.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle mt-4">
            Don't just take our word for it — hear from our happy customers
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={idx} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
