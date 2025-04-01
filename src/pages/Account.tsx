
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, LogOut, History, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OrderTrackingCard from "@/components/order/OrderTrackingCard";
import { useQuery } from "@tanstack/react-query";
import ProfileForm from "@/components/account/ProfileForm";

const Account = () => {
  const { user, signOut, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const fetchUserOrders = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  };

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['userOrders', user?.id],
    queryFn: fetchUserOrders,
    enabled: !!user,
  });

  // Generate a unique Somali-style order reference
  const generateOrderReference = (orderId: string) => {
    if (orderId) {
      // Use the first 8 characters of the order ID
      const shortId = orderId.slice(0, 8);
      return `BRW-${shortId}`;
    }
    return "Unknown";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 mt-8 text-center">
          <p>Please log in to view your account.</p>
          <Button onClick={() => navigate("/auth")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-serif font-medium">My Account</h1>
              <p className="text-muted-foreground">
                Welcome back{profile?.customer_name ? `, ${profile.customer_name}` : ''}
              </p>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="mr-2 h-4 w-4" /> My Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View your previous orders and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order Reference</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((order: any) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">
                                  {generateOrderReference(order.id)}
                                </TableCell>
                                <TableCell>{formatDate(order.created_at)}</TableCell>
                                <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                                <TableCell>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.order_status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.order_status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    order.order_status.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    order.order_status.toLowerCase() === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                    order.order_status.toLowerCase() === 'out_for_delivery' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.order_status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    onClick={() => setActiveTab(`order-${order.id}`)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-md bg-muted/20">
                      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No orders found</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't placed any orders yet.
                      </p>
                      <Button onClick={() => navigate("/shop")}>
                        Browse Products
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {orders.map((order: any) => (
              <TabsContent key={`order-${order.id}`} value={`order-${order.id}`}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Order Details</CardTitle>
                        <CardDescription>
                          {generateOrderReference(order.id)} - {formatDate(order.created_at)}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" onClick={() => setActiveTab("orders")}>
                        <History className="mr-2 h-4 w-4" /> Back to Orders
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <OrderTrackingCard
                        orderReference={generateOrderReference(order.id)}
                        orderStatus={order.order_status}
                        createdAt={order.created_at}
                      />
                    
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Order Summary</h3>
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.items.map((item: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell className="text-right">{item.quantity}</TableCell>
                                  <TableCell className="text-right">${Number(item.price).toFixed(2)}</TableCell>
                                  <TableCell className="text-right">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                                <TableCell className="text-right font-medium">${Number(order.total_amount).toFixed(2)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Shipping Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-muted/30 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Delivery Address</h4>
                            <p className="text-muted-foreground">
                              {order.shipping_address}<br />
                              {order.city}, {order.region}
                            </p>
                          </div>
                          <div className="bg-muted/30 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Payment Method</h4>
                            <p className="text-muted-foreground">{order.payment_method}</p>
                            <p className="text-muted-foreground mt-2">
                              <span className="font-medium">Payment Status:</span>{" "}
                              <span className={`${
                                order.payment_status.toLowerCase() === "paid" ? "text-green-600" : 
                                order.payment_status.toLowerCase() === "pending" ? "text-amber-600" :
                                "text-red-600"
                              }`}>
                                {order.payment_status}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default Account;
