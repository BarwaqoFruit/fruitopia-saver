
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const profileSchema = z.object({
  customer_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(5, { message: "Please enter a valid phone number" }),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm = () => {
  const { user, profile, refreshProfile } = useAuth();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      customer_name: "",
      phone: "",
      address: "",
      city: "",
      region: "",
    },
  });

  // Update form values when profile is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        customer_name: profile.customer_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        region: profile.region || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          customer_name: values.customer_name,
          phone: values.phone,
          address: values.address,
          city: values.city,
          region: values.region,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      await refreshProfile();
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="customer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+252 61 234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Mogadishu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input placeholder="Banadir" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>Email</FormLabel>
            <Input value={user?.email || ""} disabled />
          </div>
        </div>
        
        <Button type="submit">
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
