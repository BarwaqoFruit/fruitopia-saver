
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";
import { Json } from "@/integrations/supabase/types";

// Interface for payment details
export interface PaymentDetails {
  wafi_number?: string;
  transaction_id?: string;
  payment_type?: string;
}

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
  payment_details?: PaymentDetails;
}

// Function to save order to Supabase
export const saveOrder = async (orderDetails: OrderDetails) => {
  // Convert CartItem[] to a JSON compatible format
  const orderData = {
    customer_name: orderDetails.customer_name,
    customer_email: orderDetails.customer_email,
    customer_phone: orderDetails.customer_phone,
    shipping_address: orderDetails.shipping_address,
    city: orderDetails.city,
    region: orderDetails.region,
    payment_method: orderDetails.payment_method,
    payment_status: orderDetails.payment_status,
    order_status: orderDetails.order_status,
    total_amount: orderDetails.total_amount,
    items: orderDetails.items as unknown as Json,
    payment_details: orderDetails.payment_details as unknown as Json,
  };

  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select('id');

  if (error) {
    console.error('Error saving order:', error);
    throw new Error('Failed to save order');
  }

  return data?.[0]?.id;
};

// Function to get all orders
export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }

  return data || [];
};

// Function to search orders
export const searchOrders = async (query: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .or(`customer_name.ilike.%${query}%,customer_email.ilike.%${query}%,customer_phone.ilike.%${query}%,id.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching orders:', error);
    throw new Error('Failed to search orders');
  }

  return data || [];
};

// Function to filter orders by status
export const filterOrdersByStatus = async (status: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error filtering orders:', error);
    throw new Error('Failed to filter orders');
  }

  return data || [];
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

// Function to update payment details
export const updatePaymentDetails = async (orderId: string, details: PaymentDetails) => {
  // Convert PaymentDetails to JSON for Supabase
  const { error } = await supabase
    .from('orders')
    .update({ payment_details: details as unknown as Json })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating payment details:', error);
    throw new Error('Failed to update payment details');
  }
};
