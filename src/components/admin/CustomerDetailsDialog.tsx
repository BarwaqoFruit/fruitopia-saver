
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin, Calendar, DollarSign, Package, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  customer: any;
}

const CustomerDetailsDialog = ({ isOpen, setIsOpen, customer }: CustomerDetailsDialogProps) => {
  if (!customer) return null;

  const { data: customerOrders, isLoading } = useQuery({
    queryKey: ['customerOrders', customer.email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', customer.email)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: isOpen && !!customer?.email
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            View detailed information about this customer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">{customer.name}</span>
                {customer.status === 'inactive' && (
                  <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">Inactive</span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                
                {customer.address && (
                  <div className="flex items-center col-span-2">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{customer.address}, {customer.city}, {customer.region}</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-muted-foreground text-sm">Total Orders</p>
                  <p className="text-lg font-medium flex items-center">
                    <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                    {customer.orders}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Spent</p>
                  <p className="text-lg font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    ${customer.totalSpent.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Last Order</p>
                  <p className="text-lg font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {formatDate(customer.lastOrderDate)}
                  </p>
                </div>
              </div>
              
              {customer.notes && (
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-foreground text-sm mb-1">Notes</p>
                  <p className="text-sm">{customer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : !customerOrders || customerOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No order history found</p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {customerOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{formatDate(order.created_at)}</p>
                          <p className="text-xs text-muted-foreground font-mono">{order.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.order_status)}`}>
                            {order.order_status}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.payment_status)}`}>
                            {order.payment_status}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2 mt-2">
                        <div className="flex items-center">
                          <ClipboardList className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{(order.items as any[]).length} items</span>
                        </div>
                        <p className="font-medium">${Number(order.total_amount).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  
                  {customerOrders.length > 5 && (
                    <p className="text-center text-sm text-muted-foreground">
                      +{customerOrders.length - 5} more orders
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;
