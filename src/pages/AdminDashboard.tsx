
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, ShoppingBag, Users, Settings, Eye, 
  CheckCircle, XCircle, RefreshCw, AlertTriangle, Search, Filter, X
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOrders, updateOrderStatus, updatePaymentStatus, searchOrders, filterOrdersByStatus } from "@/utils/orderUtils";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
      setActiveFilter(null);
      setSearchQuery("");
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchOrders();
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await searchOrders(searchQuery);
      setOrders(data);
      setActiveFilter(null);
    } catch (error) {
      console.error("Error searching orders:", error);
      toast.error("Failed to search orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async (status: string) => {
    setIsLoading(true);
    try {
      const data = await filterOrdersByStatus(status);
      setOrders(data);
      setActiveFilter(status);
      setSearchQuery("");
    } catch (error) {
      console.error("Error filtering orders:", error);
      toast.error("Failed to filter orders");
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    fetchOrders();
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
          <p className="text-muted-foreground">
            {searchQuery ? "No orders matching your search criteria." : activeFilter ? `No orders with status "${activeFilter}".` : "There are no orders in the system yet."}
          </p>
          {(searchQuery || activeFilter) && (
            <Button onClick={clearFilters} variant="outline" className="mt-4">
              Clear Filters
            </Button>
          )}
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
              <TableHead>Payment Info</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                <TableCell>
                  <div>{order.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>${order.total_amount}</TableCell>
                <TableCell>
                  <div className="text-xs">
                    {order.payment_method}
                    {order.payment_details && (
                      <div className="mt-1">
                        {order.payment_details.wafi_number && (
                          <div className="truncate">
                            Wafi: {order.payment_details.wafi_number}
                          </div>
                        )}
                        {order.payment_details.payment_type && (
                          <div className="truncate">
                            Type: {order.payment_details.payment_type}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
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
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by name, email, phone or ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchQuery && (
                  <button 
                    onClick={() => { setSearchQuery(''); fetchOrders(); }}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button onClick={handleSearch} className="shrink-0">
                Search
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="shrink-0">
                    <Filter className="mr-2 h-4 w-4" />
                    {activeFilter ? `Filter: ${activeFilter}` : "Filter"}
                    {activeFilter && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); clearFilters(); }}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleFilter('processing')}>
                    Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter('shipped')}>
                    Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter('completed')}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilter('cancelled')}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || activeFilter) && (
              <div className="flex items-center gap-2 mb-4 text-sm">
                <span className="text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Search: {searchQuery}
                    <button onClick={() => { setSearchQuery(''); fetchOrders(); }}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {activeFilter && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Status: {activeFilter}
                    <button onClick={clearFilters}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2">
                  Clear all
                </Button>
              </div>
            )}

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
