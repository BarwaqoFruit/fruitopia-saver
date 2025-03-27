import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { 
  CreditCard, 
  User, 
  MapPin, 
  Truck, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  Phone,
  Banknote
} from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { saveOrder } from "@/utils/orderUtils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "Please select a state." }),
  zipCode: z.string().min(5, { message: "Please enter a valid ZIP code." }),
  country: z.string().min(2, { message: "Please select a country." }),
  deliveryMethod: z.string().min(1, { message: "Please select a delivery method." }),
  paymentMethod: z.string().min(1, { message: "Please select a payment method." }),
  waafiNumber: z.string().optional(),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  notes: z.string().optional(),
});

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const deliveryFee = totalPrice > 50 ? 0 : 5;
  const tax = totalPrice * 0.05;
  const orderTotal = totalPrice + deliveryFee + tax;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Somalia",
      deliveryMethod: "standard",
      paymentMethod: "waafi",
      waafiNumber: "",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvc: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    
    try {
      const orderData = {
        customer_name: `${values.firstName} ${values.lastName}`,
        customer_email: values.email,
        customer_phone: values.phone,
        shipping_address: values.address,
        city: values.city,
        region: values.state,
        payment_method: values.paymentMethod,
        payment_status: "pending",
        order_status: "processing",
        total_amount: orderTotal,
        items: items
      };
      
      const orderId = await saveOrder(orderData);
      
      toast.success("Order successfully placed!", {
        description: "Your order has been confirmed and is being processed.",
      });
      
      clearCart();
      setIsProcessing(false);
      navigate(`/checkout/success?order_id=${orderId}`);
    } catch (error) {
      console.error("Error saving order:", error);
      setIsProcessing(false);
      toast.error("Error processing your order", {
        description: "Please try again or contact customer service.",
      });
    }
  };

  const goToNextStep = () => {
    const fieldsToValidate = step === 1 
      ? ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode", "country"] 
      : [];
    
    form.trigger(fieldsToValidate as any).then((isValid) => {
      if (isValid) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      }
    });
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-12 mt-8">
          <div className="text-center py-16">
            <h2 className="font-serif text-2xl mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Add some products to your cart before proceeding to checkout.
            </p>
            <Button asChild>
              <a href="/shop">Continue Shopping</a>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 mt-8">
        <h1 className="font-serif text-3xl font-medium mb-8 text-center">Checkout</h1>

        <div className="flex justify-center mb-12">
          <div className="relative flex items-center w-full max-w-3xl">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full z-10 ${step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              <User size={18} />
            </div>
            <div className={`h-1 flex-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full z-10 ${step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              <Truck size={18} />
            </div>
            <div className={`h-1 flex-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full z-10 ${step >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              <CreditCard size={18} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {step === 1 && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="mr-2 h-5 w-5" /> Personal Information
                        </CardTitle>
                        <CardDescription>
                          Enter your contact information for this order
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Abdi" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Hassan" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="abdi.hassan@example.com" {...field} />
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
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="252 61 1234567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <MapPin className="mr-2 h-5 w-5" /> Shipping Address
                        </CardTitle>
                        <CardDescription>
                          Enter the shipping address for your order
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Makka Al-Mukarama Road" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Region</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select region" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Banadir">Banadir</SelectItem>
                                    <SelectItem value="Puntland">Puntland</SelectItem>
                                    <SelectItem value="Jubaland">Jubaland</SelectItem>
                                    <SelectItem value="Southwest">Southwest</SelectItem>
                                    <SelectItem value="Hirshabelle">Hirshabelle</SelectItem>
                                    <SelectItem value="Galmudug">Galmudug</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="BN-1000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Somalia">Somalia</SelectItem>
                                    <SelectItem value="Kenya">Kenya</SelectItem>
                                    <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                                    <SelectItem value="Djibouti">Djibouti</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button type="button" onClick={goToNextStep}>
                          Continue to Shipping
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Truck className="mr-2 h-5 w-5" /> Shipping Method
                        </CardTitle>
                        <CardDescription>
                          Choose how you'd like your order delivered
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="deliveryMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-4">
                              <div className={`p-4 border rounded-lg flex items-start space-x-4 cursor-pointer transition-all ${field.value === 'standard' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                onClick={() => form.setValue('deliveryMethod', 'standard')}>
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${field.value === 'standard' ? 'border-primary' : 'border-muted-foreground'}`}>
                                  {field.value === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium">Standard Delivery</h4>
                                    <p className="font-medium">{totalPrice > 50 ? 'Free' : '$5.00'}</p>
                                  </div>
                                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" /> Delivery in 1-2 days in Mogadishu, 2-4 days elsewhere
                                  </div>
                                  {totalPrice > 50 && (
                                    <p className="text-sm text-primary mt-1">Free shipping on orders over $50</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className={`p-4 border rounded-lg flex items-start space-x-4 cursor-pointer transition-all ${field.value === 'express' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                onClick={() => form.setValue('deliveryMethod', 'express')}>
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${field.value === 'express' ? 'border-primary' : 'border-muted-foreground'}`}>
                                  {field.value === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium">Express Delivery</h4>
                                    <p className="font-medium">$10.00</p>
                                  </div>
                                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" /> Same-day delivery in Mogadishu, next day elsewhere
                                  </div>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Special instructions for delivery"
                                  className="resize-none"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={goToPreviousStep}>
                          Back to Information
                        </Button>
                        <Button type="button" onClick={goToNextStep}>
                          Continue to Payment
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CreditCard className="mr-2 h-5 w-5" /> Payment Method
                        </CardTitle>
                        <CardDescription>
                          Select your preferred payment method
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-4">
                              <div className={`p-4 border rounded-lg flex items-start space-x-4 cursor-pointer transition-all ${field.value === 'waafi' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                onClick={() => form.setValue('paymentMethod', 'waafi')}>
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${field.value === 'waafi' ? 'border-primary' : 'border-muted-foreground'}`}>
                                  {field.value === 'waafi' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">Waafi Pay</h4>
                                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4 mr-1" /> Pay using your Waafi mobile money account
                                  </div>
                                  
                                  {field.value === 'waafi' && (
                                    <div className="mt-4 space-y-4">
                                      <FormField
                                        control={form.control}
                                        name="waafiNumber"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Waafi Number</FormLabel>
                                            <FormControl>
                                              <Input placeholder="252 61 1234567" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className={`p-4 border rounded-lg flex items-start space-x-4 cursor-pointer transition-all ${field.value === 'cash' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                onClick={() => form.setValue('paymentMethod', 'cash')}>
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${field.value === 'cash' ? 'border-primary' : 'border-muted-foreground'}`}>
                                  {field.value === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">Cash on Delivery</h4>
                                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                    <Banknote className="h-4 w-4 mr-1" /> Pay in cash when your order is delivered
                                  </div>
                                </div>
                              </div>
                              
                              <div className={`p-4 border rounded-lg flex items-start space-x-4 cursor-pointer transition-all ${field.value === 'card' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                onClick={() => form.setValue('paymentMethod', 'card')}>
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${field.value === 'card' ? 'border-primary' : 'border-muted-foreground'}`}>
                                  {field.value === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">Credit / Debit Card</h4>
                                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4 mr-1" /> Secure payment processing
                                  </div>
                                  
                                  {field.value === 'card' && (
                                    <div className="mt-4 space-y-4">
                                      <FormField
                                        control={form.control}
                                        name="cardNumber"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Card Number</FormLabel>
                                            <FormControl>
                                              <Input placeholder="1234 5678 9012 3456" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control}
                                        name="cardName"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Cardholder Name</FormLabel>
                                            <FormControl>
                                              <Input placeholder="Abdi Hassan" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                          control={form.control}
                                          name="cardExpiry"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Expiry Date</FormLabel>
                                              <FormControl>
                                                <Input placeholder="MM/YY" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={form.control}
                                          name="cardCvc"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>CVC</FormLabel>
                                              <FormControl>
                                                <Input placeholder="123" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={goToPreviousStep}>
                          Back to Shipping
                        </Button>
                        <Button type="submit" disabled={isProcessing} className="bg-primary hover:bg-primary/90">
                          {isProcessing ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                              Processing...
                            </>
                          ) : (
                            <>Place Order</>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}
              </form>
            </Form>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-medium">${totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Shipping</p>
                    <p className="font-medium">{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Tax (5%)</p>
                    <p className="font-medium">${tax.toFixed(2)}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-medium">
                  <p>Total</p>
                  <p className="text-gold">${orderTotal.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Checkout;
