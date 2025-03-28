import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const productFormSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than zero" }),
  category: z.string().min(1, { message: "Category is required" }),
  image: z.string().url({ message: "Valid image URL is required" }),
  isOrganic: z.boolean().default(false),
  isNew: z.boolean().default(true),
  origin: z.string().optional(),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim())),
  storage: z.string(),
  season: z.string(),
  calories: z.string(),
  fat: z.string(),
  protein: z.string(),
  carbs: z.string(),
  vitamins: z.string().transform(val => val.split(',').map(vitamin => vitamin.trim())),
});

type ProductFormValues = z.input<typeof productFormSchema>;
type ProductFormTransformed = z.output<typeof productFormSchema>;

const AddProduct = () => {
  const navigate = useNavigate();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      category: "",
      image: "",
      isOrganic: false,
      isNew: true,
      origin: "",
      tags: "",
      storage: "",
      season: "",
      calories: "",
      fat: "",
      protein: "",
      carbs: "",
      vitamins: "",
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (values: ProductFormTransformed) => {
      const { data, error } = await supabase.from('products').insert([
        {
          name: values.name,
          description: values.description,
          price: values.price,
          category: values.category,
          image: values.image,
          isorganic: values.isOrganic,
          isnew: values.isNew,
          origin: values.origin || null,
          tags: values.tags,
          nutritionalinfo: {
            calories: values.calories,
            fat: values.fat,
            protein: values.protein,
            carbs: values.carbs,
            vitamins: values.vitamins,
          },
          storage: values.storage,
          season: values.season,
          rating: 5.0,
        }
      ]).select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Product added successfully");
      navigate("/admin/products");
    },
    onError: (error) => {
      toast.error("Failed to add product");
      console.error("Error adding product:", error);
    }
  });

  const onSubmit = (values: ProductFormValues) => {
    addProductMutation.mutate(values as unknown as ProductFormTransformed);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/admin/products")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
            <h1 className="text-2xl font-serif">Add New Product</h1>
          </div>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={addProductMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {addProductMutation.isPending ? "Saving..." : "Save Product"}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter product description" 
                              rows={5}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (USD)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                placeholder="0.00" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Tropical, Berries" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter a valid URL for the product image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Origin (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Spain, Mexico" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. sweet, juicy, summer" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Separate multiple tags with commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="isOrganic"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>Organic Product</FormLabel>
                              <FormDescription>
                                Mark if this product is organic
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isNew"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>New Arrival</FormLabel>
                              <FormDescription>
                                Mark as a new product
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Storage & Season</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="storage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Storage Instructions</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="How to store this product" 
                                rows={3}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="season"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Season</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Summer, All Year" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Nutritional Information</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="calories"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Calories</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 95 kcal" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-3 gap-2">
                        <FormField
                          control={form.control}
                          name="fat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fat</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 0.3g" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="protein"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Protein</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 1.1g" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="carbs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Carbs</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 25g" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="vitamins"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vitamins</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. C, A, Potassium" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Separate vitamins with commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={addProductMutation.isPending}
              >
                {addProductMutation.isPending ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
};

export default AddProduct;
