
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageLayout from "@/components/layout/PageLayout";
import { toast } from "sonner";

// Define schemas for different settings forms
const generalFormSchema = z.object({
  storeName: z.string().min(2, { message: "Store name must be at least 2 characters." }),
  storeEmail: z.string().email({ message: "Please enter a valid email address." }),
  storePhone: z.string().min(5, { message: "Please enter a valid phone number." }),
  storeAddress: z.string().min(5, { message: "Address must be at least 5 characters." }),
  currency: z.string().min(1, { message: "Please select a currency." }),
  taxRate: z.coerce.number().min(0).max(100, { message: "Tax rate must be between 0 and 100." }),
});

const emailFormSchema = z.object({
  sendOrderConfirmation: z.boolean().default(true),
  sendShippingUpdates: z.boolean().default(true),
  sendPromotions: z.boolean().default(false),
  emailFooter: z.string().optional(),
});

const paymentFormSchema = z.object({
  enableStripe: z.boolean().default(true),
  enablePaypal: z.boolean().default(false),
  enableCashOnDelivery: z.boolean().default(true),
  testMode: z.boolean().default(true),
  stripePublishableKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  paypalClientId: z.string().optional(),
  paypalClientSecret: z.string().optional(),
});

const shippingFormSchema = z.object({
  enableFreeShipping: z.boolean().default(true),
  freeShippingThreshold: z.coerce.number().min(0),
  enableLocalPickup: z.boolean().default(true),
  enableExpressShipping: z.boolean().default(true),
  baseShippingRate: z.coerce.number().min(0),
  expressShippingRate: z.coerce.number().min(0),
  shippingTaxable: z.boolean().default(false),
  shippingCalculationMethod: z.enum(["flat", "weight", "price"]),
  shippingAddressPolicy: z.enum(["required", "optional"]),
});

const AdminSettings = () => {
  // Initialize the forms
  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      storeName: "FruitFusion Market",
      storeEmail: "hello@fruitfusion.com",
      storePhone: "+1 (555) 123-4567",
      storeAddress: "123 Fresh Fruit Street, Orchard City, CA 94000",
      currency: "USD",
      taxRate: 8.5,
    },
  });

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      sendOrderConfirmation: true,
      sendShippingUpdates: true,
      sendPromotions: false,
      emailFooter: "© 2023 FruitFusion Market. All rights reserved.",
    },
  });

  const paymentForm = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      enableStripe: true,
      enablePaypal: false,
      enableCashOnDelivery: true,
      testMode: true,
      stripePublishableKey: "",
      stripeSecretKey: "",
      paypalClientId: "",
      paypalClientSecret: "",
    },
  });

  const shippingForm = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      enableFreeShipping: true,
      freeShippingThreshold: 50,
      enableLocalPickup: true,
      enableExpressShipping: true,
      baseShippingRate: 5.99,
      expressShippingRate: 15.99,
      shippingTaxable: false,
      shippingCalculationMethod: "flat",
      shippingAddressPolicy: "required",
    },
  });

  // Form submission handlers
  const onGeneralSubmit = (data: z.infer<typeof generalFormSchema>) => {
    console.log("General settings updated:", data);
    toast.success("General settings updated successfully");
  };

  const onEmailSubmit = (data: z.infer<typeof emailFormSchema>) => {
    console.log("Email settings updated:", data);
    toast.success("Email settings updated successfully");
  };

  const onPaymentSubmit = (data: z.infer<typeof paymentFormSchema>) => {
    console.log("Payment settings updated:", data);
    toast.success("Payment settings updated successfully");
  };

  const onShippingSubmit = (data: z.infer<typeof shippingFormSchema>) => {
    console.log("Shipping settings updated:", data);
    toast.success("Shipping settings updated successfully");
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">Admin Settings</h1>
          <p className="text-muted-foreground">Configure your store settings</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email Notifications</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your store's basic information.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                    <FormField
                      control={generalForm.control}
                      name="storeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            This is the name that will appear on receipts and in the header.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={generalForm.control}
                        name="storeEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={generalForm.control}
                        name="storePhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={generalForm.control}
                      name="storeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={generalForm.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Currency code (e.g. USD, EUR, GBP)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={generalForm.control}
                        name="taxRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax Rate (%)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit">Save General Settings</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings Tab */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Notification Settings</CardTitle>
                <CardDescription>Configure how and when emails are sent to customers.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                    <FormField
                      control={emailForm.control}
                      name="sendOrderConfirmation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Order Confirmations</FormLabel>
                            <FormDescription>
                              Send email confirmations when customers place an order.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="sendShippingUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Shipping Updates</FormLabel>
                            <FormDescription>
                              Send email notifications when order status changes.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="sendPromotions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Promotional Emails</FormLabel>
                            <FormDescription>
                              Send promotional emails and newsletters to customers.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="emailFooter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Footer Text</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormDescription>
                            This text will appear at the bottom of all emails.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Save Email Settings</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure your payment methods and options.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...paymentForm}>
                  <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={paymentForm.control}
                        name="enableStripe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Stripe Payments</FormLabel>
                              <FormDescription>
                                Accept credit card payments via Stripe.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {paymentForm.watch("enableStripe") && (
                        <div className="ml-4 pl-4 border-l space-y-4">
                          <FormField
                            control={paymentForm.control}
                            name="stripePublishableKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stripe Publishable Key</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="pk_test_..."
                                    type="password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Your Stripe publishable key (starts with pk_).
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={paymentForm.control}
                            name="stripeSecretKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stripe Secret Key</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="sk_test_..."
                                    type="password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Your Stripe secret key (starts with sk_). This should be kept secure.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      <FormField
                        control={paymentForm.control}
                        name="enablePaypal"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">PayPal Payments</FormLabel>
                              <FormDescription>
                                Accept payments via PayPal.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {paymentForm.watch("enablePaypal") && (
                        <div className="ml-4 pl-4 border-l space-y-4">
                          <FormField
                            control={paymentForm.control}
                            name="paypalClientId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PayPal Client ID</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your PayPal client ID"
                                    type="password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={paymentForm.control}
                            name="paypalClientSecret"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PayPal Client Secret</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your PayPal client secret"
                                    type="password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      <FormField
                        control={paymentForm.control}
                        name="enableCashOnDelivery"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Cash on Delivery</FormLabel>
                              <FormDescription>
                                Allow customers to pay when their order is delivered.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={paymentForm.control}
                        name="testMode"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Test Mode</FormLabel>
                              <FormDescription>
                                Process payments in test mode (no real charges).
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit">Save Payment Settings</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Settings</CardTitle>
                <CardDescription>Configure your shipping methods and rates.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...shippingForm}>
                  <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={shippingForm.control}
                        name="shippingCalculationMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipping Calculation Method</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a calculation method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="flat">Flat Rate</SelectItem>
                                <SelectItem value="weight">Weight Based</SelectItem>
                                <SelectItem value="price">Price Based</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How shipping costs will be calculated.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shippingForm.control}
                        name="baseShippingRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base Shipping Rate ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormDescription>
                              Standard shipping rate applied to all orders.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shippingForm.control}
                        name="enableFreeShipping"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Free Shipping</FormLabel>
                              <FormDescription>
                                Offer free shipping on orders above a certain amount.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {shippingForm.watch("enableFreeShipping") && (
                        <div className="ml-4 pl-4 border-l">
                          <FormField
                            control={shippingForm.control}
                            name="freeShippingThreshold"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Free Shipping Threshold ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Orders above this amount qualify for free shipping.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      <FormField
                        control={shippingForm.control}
                        name="enableExpressShipping"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Express Shipping</FormLabel>
                              <FormDescription>
                                Offer express shipping option.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {shippingForm.watch("enableExpressShipping") && (
                        <div className="ml-4 pl-4 border-l">
                          <FormField
                            control={shippingForm.control}
                            name="expressShippingRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Express Shipping Rate ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Rate for express (1-2 day) shipping.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      <FormField
                        control={shippingForm.control}
                        name="enableLocalPickup"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Local Pickup</FormLabel>
                              <FormDescription>
                                Allow customers to pick up orders from your location.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shippingForm.control}
                        name="shippingTaxable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Taxable Shipping</FormLabel>
                              <FormDescription>
                                Apply tax to shipping costs.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shippingForm.control}
                        name="shippingAddressPolicy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipping Address Policy</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a policy" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="required">Required</SelectItem>
                                <SelectItem value="optional">Optional</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Whether a shipping address is required at checkout.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit">Save Shipping Settings</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminSettings;
