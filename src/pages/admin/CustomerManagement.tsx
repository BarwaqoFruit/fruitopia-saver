
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, RefreshCw, AlertTriangle, Eye, UserPlus } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/utils/orderUtils";
import { toast } from "sonner";

const CustomerManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['customerOrders'],
    queryFn: getOrders
  });

  // Extract unique customers from orders
  const uniqueCustomers = React.useMemo(() => {
    const customersMap = new Map();
    
    orders.forEach(order => {
      if (!customersMap.has(order.customer_email)) {
        customersMap.set(order.customer_email, {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          orders: 1,
          totalSpent: Number(order.total_amount),
          lastOrderDate: new Date(order.created_at)
        });
      } else {
        const customer = customersMap.get(order.customer_email);
        customer.orders += 1;
        customer.totalSpent += Number(order.total_amount);
        
        const orderDate = new Date(order.created_at);
        if (orderDate > customer.lastOrderDate) {
          customer.lastOrderDate = orderDate;
        }
      }
    });
    
    return Array.from(customersMap.values());
  }, [orders]);
  
  // Filter customers based on search query
  const filteredCustomers = React.useMemo(() => {
    if (!searchQuery.trim()) return uniqueCustomers;
    
    const query = searchQuery.toLowerCase();
    return uniqueCustomers.filter(customer => 
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)
    );
  }, [uniqueCustomers, searchQuery]);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleRefresh = () => {
    refetch();
    toast.success("Customer data refreshed");
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Customer Management</h1>
            <p className="text-muted-foreground">View and manage your customers</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw size={16} className="mr-2" /> Refresh
            </Button>
            <Button>
              <UserPlus size={16} className="mr-2" /> Add Customer
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueCustomers.length}</div>
            </CardContent>
          </Card>
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
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${uniqueCustomers.reduce((total, customer) => total + customer.totalSpent, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name, email or phone..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium">Error loading customers</h3>
            <p className="text-muted-foreground">There was a problem loading customer data.</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium">No customers found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "No customers matching your search criteria." : "You don't have any customers yet."}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(customer.lastOrderDate)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View customer</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CustomerManagement;
