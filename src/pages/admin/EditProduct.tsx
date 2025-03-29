
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, ArrowLeft, Trash2, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PageLayout from "@/components/layout/PageLayout";
import { fetchProductById, Product, NutritionalInfo } from "@/utils/productUtils";
import { updateProduct } from "@/utils/productUtils";

// Form schema
const productSchema = z.object({
  name: z.string().min(2, { message: "Product name is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  category: z.string().min(1, { message: "Category is required" }),
  image: z.string().url({ message: "A valid image URL is required" }),
  rating: z.coerce.number().min(0).max(5),
  isOrganic: z.boolean().default(false),
  isNew: z.boolean().default(false),
  origin: z.string().optional(),
  tags: z.array(z.string()).default([]),
  nutritionalInfo: z.object({
    calories: z.string(),
    fat: z.string(),
    protein: z.string(),
    carbs: z.string(),
    vitamins: z.array(z.string()).default([]),
  }),
  storage: z.string(),
  season: z.string(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState("");
  const [vitaminInput, setVitaminInput] = useState("");

  // Create form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      rating: 4,
      isOrganic: false,
      isNew: false,
      origin: "",
      tags: [],
      nutritionalInfo: {
        calories: "0",
        fat: "0g",
        protein: "0g",
        carbs: "0g",
        vitamins: [],
      },
      storage: "Store in a cool, dry place.",
      season: "Available year-round.",
    },
  });

  // Fetch product details - fixed the onSuccess callback using options
  const { isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    onSuccess: (product) => {
      if (product) {
        // Reset form with product data
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          rating: product.rating,
          isOrganic: product.isOrganic,
          isNew: product.isNew,
          origin: product.origin || "",
          tags: product.tags,
          nutritionalInfo: {
            calories: product.nutritionalInfo.calories,
            fat: product.nutritionalInfo.fat,
            protein: product.nutritionalInfo.protein,
            carbs: product.nutritionalInfo.carbs,
            vitamins: product.nutritionalInfo.vitamins,
          },
          storage: product.storage,
          season: product.season,
        });
      }
    }
  });

  // Update product mutation - fixed to ensure nutritionalInfo has all required fields
  const updateMutation = useMutation({
    mutationFn: (data: ProductFormValues) => {
      if (!id) throw new Error("Product ID is required");
      // Ensure all nutritionalInfo fields are present even if they're empty strings
      const formattedData: Partial<Product> = {
        ...data,
        nutritionalInfo: {
          calories: data.nutritionalInfo.calories || "0",
          fat: data.nutritionalInfo.fat || "0g",
          protein: data.nutritionalInfo.protein || "0g",
          carbs: data.nutritionalInfo.carbs || "0g",
          vitamins: data.nutritionalInfo.vitamins || [],
        }
      };
      return updateProduct(id, formattedData);
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      navigate("/admin/products");
    },
    onError: (error: Error) => {
      toast.error(`Error updating product: ${error.message}`);
    },
  });

  // Submit handler
  const onSubmit = (data: ProductFormValues) => {
    updateMutation.mutate(data);
  };

  // Tag handlers
  const addTag = () => {
    if (tagInput.trim() !== "" && !form.getValues().tags.includes(tagInput.trim())) {
      form.setValue("tags", [...form.getValues().tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    form.setValue(
      "tags",
      form.getValues().tags.filter((t) => t !== tag)
    );
  };

  // Vitamin handlers
  const addVitamin = () => {
    if (
      vitaminInput.trim() !== "" &&
      !form.getValues().nutritionalInfo.vitamins.includes(vitaminInput.trim())
    ) {
      form.setValue("nutritionalInfo.vitamins", [
        ...form.getValues().nutritionalInfo.vitamins,
        vitaminInput.trim(),
      ]);
      setVitaminInput("");
    }
  };

  const removeVitamin = (vitamin: string) => {
    form.setValue(
      "nutritionalInfo.vitamins",
      form.getValues().nutritionalInfo.vitamins.filter((v) => v !== vitamin)
    );
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">Loading product...</div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-red-500">
            Error loading product: {(error as Error).message}
          </div>
          <div className="text-center mt-4">
            <Button onClick={() => navigate("/admin/products")}>
              Back to Products
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/products")}
              className="mb-2"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Products
            </Button>
            <h1 className="text-3xl font-serif">Edit Product</h1>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Info Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-medium">Basic Information</h2>
                
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
                          {...field} 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
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
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {["Fruits", "Vegetables", "Berries", "Nuts", "Exotic"].map((category) => (
                            <FormItem key={category} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={category} checked={field.value === category} />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {category}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Origin country (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Additional Info Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-medium">Additional Information</h2>
                
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (0-5)</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4 pt-2">
                          <Slider
                            min={0}
                            max={5}
                            step={0.1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="flex-grow"
                          />
                          <span className="font-medium">{field.value.toFixed(1)}</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="isOrganic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Organic</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>New Product</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Add tag"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <Button type="button" onClick={addTag}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.watch("tags").map((tag) => (
                          <div key={tag} className="flex items-center bg-muted px-2 py-1 rounded-md">
                            <span className="mr-1">{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="storage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Instructions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="How to store this product" {...field} />
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
                      <FormLabel>Seasonal Availability</FormLabel>
                      <FormControl>
                        <Input placeholder="When is this product in season" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Nutritional Info Section */}
            <div>
              <h2 className="text-xl font-medium mb-4">Nutritional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nutritionalInfo.calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nutritionalInfo.fat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fat</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2g" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nutritionalInfo.protein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1g" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nutritionalInfo.carbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbohydrates</FormLabel>
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
                name="nutritionalInfo.vitamins"
                render={() => (
                  <FormItem className="mt-4">
                    <FormLabel>Vitamins & Minerals</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={vitaminInput}
                        onChange={(e) => setVitaminInput(e.target.value)}
                        placeholder="Add vitamin or mineral"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addVitamin();
                          }
                        }}
                      />
                      <Button type="button" onClick={addVitamin}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("nutritionalInfo.vitamins").map((vitamin) => (
                        <div key={vitamin} className="flex items-center bg-muted px-2 py-1 rounded-md">
                          <span className="mr-1">{vitamin}</span>
                          <button
                            type="button"
                            onClick={() => removeVitamin(vitamin)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Preview Section */}
            <div>
              <h2 className="text-xl font-medium mb-4">Product Preview</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 bg-muted rounded-md overflow-hidden">
                      {form.watch("image") ? (
                        <img 
                          src={form.watch("image")} 
                          alt="Product preview" 
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-64 flex items-center justify-center bg-muted text-muted-foreground">
                          No image preview
                        </div>
                      )}
                    </div>
                    <div className="w-full md:w-2/3">
                      <h3 className="text-2xl font-semibold mb-2">{form.watch("name") || "Product Name"}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < form.watch("rating") ? "fill-gold text-gold" : "text-muted"}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({form.watch("rating").toFixed(1)})
                        </span>
                      </div>
                      <p className="text-xl font-semibold mb-4">${Number(form.watch("price")).toFixed(2)}</p>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {form.watch("description") || "Product description will appear here"}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {form.watch("category") && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
                            {form.watch("category")}
                          </span>
                        )}
                        {form.watch("isOrganic") && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-md">
                            Organic
                          </span>
                        )}
                        {form.watch("isNew") && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : (
                  <>
                    <Save size={16} className="mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
};

export default EditProduct;
