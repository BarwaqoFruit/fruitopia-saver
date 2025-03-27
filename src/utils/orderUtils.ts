
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";

// Interface for order details
export interface OrderDetails {
  id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  region: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total_amount: number;
  items: CartItem[];
  created_at?: string;
}

// Function to save order to Supabase
export const saveOrder = async (orderDetails: OrderDetails) => {
  // Convert items array to JSON string for storage
  const orderData = {
    ...orderDetails,
    items: orderDetails.items,
  };

  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select('id');

  if (error) {
    console.error('Error saving order:', error);
    throw new Error('Failed to save order');
  }

  return data?.[0]?.id;
};

// Function to get order by ID
export const getOrderById = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }

  return data;
};

// Function to update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

// Function to update payment status
export const updatePaymentStatus = async (orderId: string, status: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating payment status:', error);
    throw new Error('Failed to update payment status');
  }
};
