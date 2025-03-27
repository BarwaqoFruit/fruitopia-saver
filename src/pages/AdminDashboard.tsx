
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, ShoppingBag, Users, Settings, Eye, 
  CheckCircle, XCircle, RefreshCw, AlertTriangle
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrders, updateOrderStatus, updatePaymentStatus } from "@/utils/orderUtils";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, status: string) => {
    try {
      await updatePaymentStatus(orderId, status);
      toast.success(`Payment status updated to ${status}`);
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return "bg-green-100 text-green-800";
      case 'processing':
      case 'pending':
        return "bg-blue-100 text-blue-800";
      case 'cancelled':
      case 'failed':
        return "bg-red-100 text-red-800";
      case 'shipped':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderOrdersTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-muted-foreground">There are no orders in the system yet.</p>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>${order.total_amount}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.payment_status)}>
                    {order.payment_status}
                  </Badge>
                  <div className="flex mt-2 space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={() => handleUpdatePaymentStatus(order.id, 'paid')}
                    >
                      Mark Paid
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={() => handleUpdatePaymentStatus(order.id, 'pending')}
                    >
                      Pending
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.order_status)}>
                    {order.order_status}
                  </Badge>
                  <div className="flex mt-2 space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                    >
                      Processing
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                    >
                      Shipped
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                    >
                      Completed
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-medium">Admin Dashboard</h1>
          <Button onClick={fetchOrders}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${orders.reduce((sum, order) => sum + Number(order.total_amount), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => order.order_status === 'processing').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => order.order_status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" disabled>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="customers" disabled>
              <Users className="mr-2 h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="settings" disabled>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            {renderOrdersTable()}
          </TabsContent>
          
          <TabsContent value="products">
            <div className="rounded-md border p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Products Management</h3>
              <p className="text-muted-foreground mb-4">This feature is coming soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="customers">
            <div className="rounded-md border p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Customer Management</h3>
              <p className="text-muted-foreground mb-4">This feature is coming soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="rounded-md border p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Settings</h3>
              <p className="text-muted-foreground mb-4">This feature is coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
