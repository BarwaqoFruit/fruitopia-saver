
import { supabase } from "@/integrations/supabase/client";

export interface NutritionalInfo {
  calories: string;
  fat: string;
  protein: string;
  carbs: string;
  vitamins: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  isOrganic: boolean;
  isNew: boolean;
  origin?: string;
  tags: string[];
  nutritionalInfo: NutritionalInfo;
  storage: string;
  season: string;
  created_at: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data as Product[];
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data as Product;
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data as Product[];
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('rating', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data as Product[];
};

export const getUniqueCategories = (products: Product[]): string[] => {
  return Array.from(new Set(products.map(product => product.category)));
};
