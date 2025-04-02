
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Users, Leaf, Home, Truck, Award, Heart } from "lucide-react";

const About = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 mt-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl font-medium mb-6 text-center">About Barwaqo</h1>
          
          <div className="flex justify-center mb-8">
            <div className="p-4 rounded-full bg-gold/10">
              <Users className="h-12 w-12 text-gold" />
            </div>
          </div>
          
          <p className="text-lg text-center mb-12">
            Barwaqo is a premium fruit delivery service dedicated to bringing the freshest, highest-quality fruits to your doorstep.
          </p>
          
          <div className="mb-16">
            <h2 className="font-serif text-2xl mb-6">Our Story</h2>
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <p className="mb-4">
                Founded in 2020, Barwaqo was born from a simple idea: everyone deserves access to fresh, delicious fruits regardless of where they live.
              </p>
              <p className="mb-4">
                Our founder, Sarah, grew up in a small farming community where fresh produce was abundant. When she moved to the city, she was disappointed by the quality of fruits available in urban supermarkets - often harvested too early and lacking flavor.
              </p>
              <p>
                With a vision to bridge this gap, Barwaqo was established as a direct-to-consumer fruit delivery service that partners with small family farms and ethical suppliers to bring the orchard experience directly to your home.
              </p>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="font-serif text-2xl mb-6">Our Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-secondary/30 p-6 rounded-lg text-center">
                <Leaf className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-medium text-lg mb-2">Sustainability</h3>
                <p>Supporting sustainable farming practices and reducing food miles.</p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg text-center">
                <Award className="h-8 w-8 mx-auto mb-4 text-gold" />
                <h3 className="font-medium text-lg mb-2">Quality</h3>
                <p>Delivering only the freshest, most flavorful fruits available.</p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg text-center">
                <Heart className="h-8 w-8 mx-auto mb-4 text-destructive" />
                <h3 className="font-medium text-lg mb-2">Community</h3>
                <p>Building relationships with farmers and supporting local economies.</p>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="font-serif text-2xl mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border text-center">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-4">
                  <span className="text-primary font-medium">1</span>
                </div>
                <h3 className="font-medium text-lg mb-2">We Source</h3>
                <p>We partner with the best farms to source peak-season fruits.</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border text-center">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-4">
                  <span className="text-primary font-medium">2</span>
                </div>
                <h3 className="font-medium text-lg mb-2">We Deliver</h3>
                <p>Your carefully packaged fruits arrive at your doorstep.</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border text-center">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-4">
                  <span className="text-primary font-medium">3</span>
                </div>
                <h3 className="font-medium text-lg mb-2">You Enjoy</h3>
                <p>Experience the flavor of perfectly ripened fruits.</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="font-serif text-2xl mb-6">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Sarah Johnson", role: "Founder & CEO" },
                { name: "Michael Chen", role: "Operations Director" },
                { name: "Elena Perez", role: "Farm Relations" },
                { name: "James Wilson", role: "Delivery Manager" }
              ].map((person, index) => (
                <div key={index} className="bg-card p-6 rounded-lg border border-border text-center">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                  <h3 className="font-medium text-lg">{person.name}</h3>
                  <p className="text-muted-foreground">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
