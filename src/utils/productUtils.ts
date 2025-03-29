import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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

// Interface that matches exact database schema
interface ProductDB {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  isorganic: boolean;
  isnew: boolean;
  origin: string | null;
  tags: string[];
  nutritionalinfo: Json;
  storage: string;
  season: string;
  created_at: string;
}

// Function to map database product to our Product interface
const mapDBProductToProduct = (product: ProductDB): Product => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price, 
  category: product.category,
  image: product.image,
  rating: product.rating,
  isOrganic: product.isorganic,
  isNew: product.isnew,
  origin: product.origin || undefined,
  tags: product.tags,
  nutritionalInfo: {
    calories: typeof product.nutritionalinfo === 'object' && product.nutritionalinfo !== null ? 
      (product.nutritionalinfo as any).calories || "0" : "0",
    fat: typeof product.nutritionalinfo === 'object' && product.nutritionalinfo !== null ? 
      (product.nutritionalinfo as any).fat || "0g" : "0g",
    protein: typeof product.nutritionalinfo === 'object' && product.nutritionalinfo !== null ? 
      (product.nutritionalinfo as any).protein || "0g" : "0g",
    carbs: typeof product.nutritionalinfo === 'object' && product.nutritionalinfo !== null ? 
      (product.nutritionalinfo as any).carbs || "0g" : "0g",
    vitamins: typeof product.nutritionalinfo === 'object' && product.nutritionalinfo !== null && 
      Array.isArray((product.nutritionalinfo as any).vitamins) ? 
      (product.nutritionalinfo as any).vitamins || [] : []
  },
  storage: product.storage,
  season: product.season,
  created_at: product.created_at
});

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data as ProductDB[]).map(mapDBProductToProduct);
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

  return mapDBProductToProduct(data as ProductDB);
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

  return (data as ProductDB[]).map(mapDBProductToProduct);
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

  return (data as ProductDB[]).map(mapDBProductToProduct);
};

export const getUniqueCategories = (products: Product[]): string[] => {
  return Array.from(new Set(products.map(product => product.category)));
};

// New function to delete a product
export const deleteProduct = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
