
import React from "react";
import { Link } from "react-router-dom";

interface CategoryProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const CategoryCard = ({ title, description, image, link }: CategoryProps) => {
  return (
    <Link 
      to={link}
      className="group relative overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="font-serif text-2xl font-medium">{title}</h3>
        <p className="mt-2 text-sm text-white/80">{description}</p>
      </div>
    </Link>
  );
};

const FeaturedCategories = () => {
  const categories = [
    {
      title: "Organic",
      description: "Naturally grown without pesticides",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop",
      link: "/shop?category=organic"
    },
    {
      title: "Exotic",
      description: "Rare fruits from around the world",
      image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=800&auto=format&fit=crop",
      link: "/shop?category=exotic"
    },
    {
      title: "Seasonal",
      description: "Fresh picks at their peak flavor",
      image: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?q=80&w=800&auto=format&fit=crop",
      link: "/seasonal"
    },
    {
      title: "Gift Boxes",
      description: "Curated selections for any occasion",
      image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?q=80&w=800&auto=format&fit=crop",
      link: "/shop?category=gift-boxes"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl text-center mb-12">
          <h2 className="section-title">Explore Our Categories</h2>
          <p className="section-subtitle mt-4">
            Discover our carefully curated selections of premium fruits
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
