
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Phone, Mail, CreditCard, CheckCircle, Truck, AlertTriangle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PageLayout from "@/components/layout/PageLayout";
import { getOrderById, updateOrderStatus, updatePaymentStatus, updatePaymentDetails } from "@/utils/orderUtils";
import { toast } from "sonner";

// Define the payment details interface
interface PaymentDetails {
  wafi_number?: string;
  transaction_id?: string;
  payment_type?: string;
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    wafi_number: "",
    transaction_id: "",
    payment_type: ""
  });

  useEffect(() => {
    if (id) {
      fetchOrderDetails(id);
    }
  }, [id]);

  const fetchOrderDetails = async (orderId: string) => {
    setIsLoading(true);
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
      
      // Initialize payment details if they exist
      if (data.payment_details) {
        const details = data.payment_details as PaymentDetails;
        setPaymentDetails({
          wafi_number: details.wafi_number || "",
          transaction_id: details.transaction_id || "",
          payment_type: details.payment_type || ""
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (status: string) => {
    if (!id) return;
    try {
      await updateOrderStatus(id, status);
      toast.success(`Order status updated to ${status}`);
      fetchOrderDetails(id); // Refresh the order details
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleUpdatePaymentStatus = async (status: string) => {
    if (!id) return;
    try {
      await updatePaymentStatus(id, status);
      toast.success(`Payment status updated to ${status}`);
      fetchOrderDetails(id); // Refresh the order details
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    }
  };

  const handleUpdatePaymentDetails = async () => {
    if (!id) return;
    try {
      await updatePaymentDetails(id, paymentDetails);
      toast.success("Payment details updated");
      setShowPaymentDialog(false);
      fetchOrderDetails(id); // Refresh the order details
    } catch (error) {
      console.error("Error updating payment details:", error);
      toast.error("Failed to update payment details");
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

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </PageLayout>
    );
  }

  if (!order) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h1 className="text-2xl font-medium mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or may have been deleted.</p>
          <Button onClick={() => navigate('/admin')}>Return to Dashboard</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10 mt-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin')} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Package className="mr-2 h-5 w-5" />
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <CardDescription>
                      Placed on {formatDate(order.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(order.order_status)}>
                      {order.order_status}
                    </Badge>
                    <Badge className={getStatusColor(order.payment_status)}>
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Update Order Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant={order.order_status === 'processing' ? 'default' : 'outline'}
                      onClick={() => handleUpdateOrderStatus('processing')}
                    >
                      Processing
                    </Button>
                    <Button 
                      size="sm" 
                      variant={order.order_status === 'shipped' ? 'default' : 'outline'}
                      onClick={() => handleUpdateOrderStatus('shipped')}
                    >
                      <Truck className="mr-1 h-4 w-4" />
                      Shipped
                    </Button>
                    <Button 
                      size="sm" 
                      variant={order.order_status === 'completed' ? 'default' : 'outline'}
                      onClick={() => handleUpdateOrderStatus('completed')}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Completed
                    </Button>
                    <Button 
                      size="sm" 
                      variant={order.order_status === 'cancelled' ? 'default' : 'outline'}
                      onClick={() => handleUpdateOrderStatus('cancelled')}
                      className="border-red-300 hover:bg-red-100 hover:text-red-800"
                    >
                      Cancelled
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Update Payment Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant={order.payment_status === 'pending' ? 'default' : 'outline'}
                      onClick={() => handleUpdatePaymentStatus('pending')}
                    >
                      Pending
                    </Button>
                    <Button 
                      size="sm" 
                      variant={order.payment_status === 'paid' ? 'default' : 'outline'}
                      onClick={() => handleUpdatePaymentStatus('paid')}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Paid
                    </Button>
                    <Button 
                      size="sm" 
                      variant={order.payment_status === 'failed' ? 'default' : 'outline'}
                      onClick={() => handleUpdatePaymentStatus('failed')}
                      className="border-red-300 hover:bg-red-100 hover:text-red-800"
                    >
                      Failed
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="h-16 w-16 overflow-hidden rounded-md border bg-muted">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-secondary flex items-center justify-center text-secondary-foreground">
                              <Package className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <div className="font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.total_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${order.total_amount}</span>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    paid via {order.payment_method}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Name
                  </div>
                  <div className="font-medium">{order.customer_name}</div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Phone
                    </div>
                    <div className="font-medium">{order.customer_phone}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Email
                    </div>
                    <div className="font-medium">{order.customer_email}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Shipping Address
                    </div>
                    <div className="font-medium">
                      {order.shipping_address}<br />
                      {order.city}, {order.region}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start space-x-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="w-full">
                    <div className="text-sm text-muted-foreground mb-1">
                      Payment Method
                    </div>
                    <div className="font-medium capitalize mb-2">
                      {order.payment_method}
                    </div>
                    
                    {/* Payment Details Section */}
                    <div className="bg-muted p-3 rounded-md mt-2">
                      <h4 className="text-sm font-medium mb-2">Payment Details</h4>
                      {order.payment_details ? (
                        <div className="space-y-1 text-sm">
                          {(order.payment_details as PaymentDetails).wafi_number && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Wafi Number:</span>
                              <span>{(order.payment_details as PaymentDetails).wafi_number}</span>
                            </div>
                          )}
                          {(order.payment_details as PaymentDetails).transaction_id && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Transaction ID:</span>
                              <span>{(order.payment_details as PaymentDetails).transaction_id}</span>
                            </div>
                          )}
                          {(order.payment_details as PaymentDetails).payment_type && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Payment Type:</span>
                              <span>{(order.payment_details as PaymentDetails).payment_type}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No payment details available</p>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => setShowPaymentDialog(true)}
                      >
                        {order.payment_details ? "Update Payment Details" : "Add Payment Details"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={() => window.print()}>
                  Print Order Details
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/admin/orders/edit/${order.id}`)}
                  disabled
                >
                  Edit Order (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Details Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Wafi Number</label>
              <Input 
                value={paymentDetails.wafi_number || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, wafi_number: e.target.value})}
                placeholder="Enter wafi number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction ID</label>
              <Input 
                value={paymentDetails.transaction_id || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, transaction_id: e.target.value})}
                placeholder="Enter transaction ID"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Type</label>
              <Input 
                value={paymentDetails.payment_type || ""}
                onChange={(e) => setPaymentDetails({...paymentDetails, payment_type: e.target.value})}
                placeholder="Enter payment type (e.g., Mobile Money, Card)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdatePaymentDetails}>Save Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default OrderDetail;
