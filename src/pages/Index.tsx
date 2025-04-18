
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FruitFinderPreview from "@/components/home/FruitFinderPreview";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <FruitFinderPreview />
      <SustainabilitySection />
      <Testimonials />
      <CTASection />
    </PageLayout>
  );
};

export default Index;
