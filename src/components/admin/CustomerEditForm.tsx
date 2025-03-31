
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CustomerDetails } from "./CustomerDetailsDialog";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX } from "lucide-react";

// Define schema for customer form validation
const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active")
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerEditFormProps {
  customer: CustomerDetails | null;
  onClose: () => void;
}

const CustomerEditForm = ({ customer, onClose }: CustomerEditFormProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!customer?.profileId;
  
  // Initialize form with customer data or empty values
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      city: customer?.city || "",
      region: customer?.region || "",
      notes: customer?.notes || "",
      status: customer?.status || "active"
    }
  });

  const createCustomerProfile = useMutation({
    mutationFn: async (values: CustomerFormValues) => {
      const { data, error } = await supabase
        .from('customer_profiles')
        .insert([{
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address || null,
          city: values.city || null,
          region: values.region || null,
          notes: values.notes || null,
          status: values.status
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerProfiles'] });
      toast.success("Customer profile created successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to create customer profile: ${error.message}`);
    }
  });

  const updateCustomerProfile = useMutation({
    mutationFn: async (values: CustomerFormValues) => {
      const { data, error } = await supabase
        .from('customer_profiles')
        .update({
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address || null,
          city: values.city || null,
          region: values.region || null,
          notes: values.notes || null,
          status: values.status
        })
        .eq('id', customer?.profileId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerProfiles'] });
      toast.success("Customer profile updated successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to update customer profile: ${error.message}`);
    }
  });

  const onSubmit = (values: CustomerFormValues) => {
    if (isEditing) {
      updateCustomerProfile.mutate(values);
    } else {
      createCustomerProfile.mutate(values);
    }
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      return (
        <Badge variant="status" className="bg-green-100 text-green-800">
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="status" className="bg-red-100 text-red-800">
        Inactive
      </Badge>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="customer@example.com" {...field} />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+252 6X XXX XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status">
                        {field.value && (
                          <div className="flex items-center gap-2">
                            {field.value === 'active' ? 
                              <UserCheck className="h-4 w-4 text-green-500" /> : 
                              <UserX className="h-4 w-4 text-red-500" />
                            }
                            <span className="capitalize">{field.value}</span>
                            {renderStatusBadge(field.value as 'active' | 'inactive')}
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active" className="flex items-center">
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                        <span>Active</span>
                        <Badge variant="status" className="ml-2 bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive" className="flex items-center">
                      <div className="flex items-center">
                        <UserX className="h-4 w-4 mr-2 text-red-500" />
                        <span>Inactive</span>
                        <Badge variant="status" className="ml-2 bg-red-100 text-red-800">Inactive</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Input placeholder="Banaadir" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Additional information about this customer..." 
                    className="resize-none min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={createCustomerProfile.isPending || updateCustomerProfile.isPending}
          >
            {(createCustomerProfile.isPending || updateCustomerProfile.isPending) && (
              <div className="mr-2 animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"></div>
            )}
            {isEditing ? 'Update Customer' : 'Create Customer'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CustomerEditForm;
