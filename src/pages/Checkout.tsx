
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
  CheckCircle2 
} from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
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

  const deliveryFee = totalPrice > 50 ? 0 : 10;
  const tax = totalPrice * 0.07;
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
      country: "USA",
      deliveryMethod: "standard",
      paymentMethod: "card",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvc: "",
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast.success("Order successfully placed!", {
        description: "Your order has been confirmed and is being processed.",
      });
      clearCart();
      setIsProcessing(false);
      navigate("/checkout/success");
    }, 2000);
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
                                  <Input placeholder="John" {...field} />
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
                                  <Input placeholder="Doe" {...field} />
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
                                  <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                                  <Input placeholder="(123) 456-7890" {...field} />
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
                                <Input placeholder="123 Main St" {...field} />
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
                                  <Input placeholder="San Francisco" {...field} />
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
                                <FormLabel>State</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="CA">California</SelectItem>
                                    <SelectItem value="NY">New York</SelectItem>
                                    <SelectItem value="TX">Texas</SelectItem>
                                    <SelectItem value="FL">Florida</SelectItem>
                                    <SelectItem value="IL">Illinois</SelectItem>
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
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="94103" {...field} />
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
                                    <SelectItem value="USA">United States</SelectItem>
                                    <SelectItem value="CAN">Canada</SelectItem>
                                    <SelectItem value="MEX">Mexico</SelectItem>
                                    <SelectItem value="GBR">United Kingdom</SelectItem>
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
                                    <h4 className="font-medium">Standard Shipping</h4>
                                    <p className="font-medium">{totalPrice > 50 ? 'Free' : '$10.00'}</p>
                                  </div>
                                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" /> Delivery in 3-5 business days
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
                                    <h4 className="font-medium">Express Shipping</h4>
                                    <p className="font-medium">$15.00</p>
                                  </div>
                                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" /> Delivery in 1-2 business days
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
                                              <Input placeholder="John Doe" {...field} />
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
                              
                              <div className={`p-4 border rounded-lg flex items-start space-x-4 cursor-pointer transition-all ${field.value === 'paypal' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                onClick={() => form.setValue('paymentMethod', 'paypal')}>
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${field.value === 'paypal' ? 'border-primary' : 'border-muted-foreground'}`}>
                                  {field.value === 'paypal' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">PayPal</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    You'll be redirected to PayPal to complete your purchase securely.
                                  </p>
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
                    <p className="text-muted-foreground">Tax (7%)</p>
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
