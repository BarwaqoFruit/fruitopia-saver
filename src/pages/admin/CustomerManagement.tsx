import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, RefreshCw, AlertTriangle, Eye, UserPlus, Edit, Trash2, UserCog } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/utils/orderUtils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import CustomerDetailsDialog from "@/components/admin/CustomerDetailsDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerEditForm from "@/components/admin/CustomerEditForm";

const CustomerManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['customerOrders'],
    queryFn: getOrders
  });

  const { data: profiles = [], isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['customerProfiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

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
    
    const enrichedCustomers = Array.from(customersMap.values()).map(customer => {
      const profile = profiles.find(p => p.email === customer.email);
      return {
        ...customer,
        id: profile?.id || null,
        profileId: profile?.id || null,
        address: profile?.address || '',
        city: profile?.city || '',
        region: profile?.region || '',
        notes: profile?.notes || '',
        status: profile?.status || 'active',
        hasProfile: !!profile
      };
    });
    
    return enrichedCustomers;
  }, [orders, profiles]);
  
  const filteredCustomers = React.useMemo(() => {
    if (!searchQuery.trim()) return uniqueCustomers;
    
    const query = searchQuery.toLowerCase();
    return uniqueCustomers.filter(customer => 
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query) ||
      (customer.address && customer.address.toLowerCase().includes(query)) ||
      (customer.city && customer.city.toLowerCase().includes(query)) ||
      (customer.region && customer.region.toLowerCase().includes(query))
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
    queryClient.invalidateQueries({ queryKey: ['customerProfiles'] });
    toast.success("Customer data refreshed");
  };

  const deleteCustomerProfile = useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase
        .from('customer_profiles')
        .delete()
        .eq('id', profileId);
      
      if (error) throw error;
      return profileId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerProfiles'] });
      toast.success("Customer profile deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete customer profile: ${error.message}`);
    }
  });

  const handleDeleteProfile = (profileId: string) => {
    if (!profileId) {
      toast.error("No profile to delete");
      return;
    }
    
    if (confirm("Are you sure you want to delete this customer profile? This action cannot be undone.")) {
      deleteCustomerProfile.mutate(profileId);
    }
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsEditOpen(true);
  };

  const handleCreateProfile = (customer) => {
    setSelectedCustomer({
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      address: '',
      city: '',
      region: '',
      notes: '',
      status: 'active'
    });
    setIsEditOpen(true);
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
            <Button onClick={() => {
              setSelectedCustomer(null);
              setIsEditOpen(true);
            }}>
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
              <CardTitle className="text-sm font-medium">Customers with Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueCustomers.filter(c => c.hasProfile).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${uniqueCustomers.reduce((total, customer) => total + customer.totalSpent, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all" className="w-full mb-6">
          <TabsList>
            <TabsTrigger value="all">All Customers</TabsTrigger>
            <TabsTrigger value="profiles">With Profiles</TabsTrigger>
            <TabsTrigger value="no-profiles">Without Profiles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, phone, or address..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {renderCustomersTable(filteredCustomers)}
          </TabsContent>
          
          <TabsContent value="profiles" className="mt-4">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, phone, or address..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {renderCustomersTable(filteredCustomers.filter(c => c.hasProfile))}
          </TabsContent>
          
          <TabsContent value="no-profiles" className="mt-4">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, phone, or address..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {renderCustomersTable(filteredCustomers.filter(c => !c.hasProfile))}
          </TabsContent>
        </Tabs>
      </div>
      
      <CustomerDetailsDialog 
        isOpen={isDetailsOpen}
        setIsOpen={setIsDetailsOpen}
        customer={selectedCustomer}
      />
      
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer?.id ? 'Edit Customer Profile' : 'Create Customer Profile'}
            </DialogTitle>
            <DialogDescription>
              {selectedCustomer?.id 
                ? 'Update customer information and preferences' 
                : 'Create a new customer profile with their information'}
            </DialogDescription>
          </DialogHeader>
          
          <CustomerEditForm 
            customer={selectedCustomer} 
            onClose={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
  
  function renderCustomersTable(customers) {
    if (isLoading || isLoadingProfiles) {
      return (
        <div className="flex justify-center items-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium">Error loading customers</h3>
          <p className="text-muted-foreground">There was a problem loading customer data.</p>
        </div>
      );
    }

    if (customers.length === 0) {
      return (
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium">No customers found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? "No customers matching your search criteria." : "You don't have any customers yet."}
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Profile Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={index} className={customer.status === 'inactive' ? 'bg-muted/20' : ''}>
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
                <TableCell>
                  {customer.hasProfile ? (
                    <Badge variant="status" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Profile Created
                    </Badge>
                  ) : (
                    <Badge variant="status" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      No Profile
                    </Badge>
                  )}
                  {customer.status === 'inactive' && customer.hasProfile && (
                    <Badge variant="status" className="bg-red-100 text-red-800 hover:bg-red-100 ml-2">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{customer.orders}</TableCell>
                <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell>{formatDate(customer.lastOrderDate)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleViewDetails(customer)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View customer</span>
                    </Button>
                    
                    {customer.hasProfile ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit customer</span>
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => handleDeleteProfile(customer.profileId)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete customer</span>
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-green-600"
                        onClick={() => handleCreateProfile(customer)}
                      >
                        <UserCog className="h-4 w-4" />
                        <span className="sr-only">Create profile</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default CustomerManagement;
