
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Sustainability from "./pages/Sustainability";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import OrderDetail from "./pages/OrderDetail";
import ProductManagement from "./pages/admin/ProductManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";
import AdminLogin from "./pages/admin/AdminLogin";

function App() {
  // Create a client inside the function component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <AdminAuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/sustainability" element={<Sustainability />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/account" element={<Index />} /> {/* Placeholder for Account page */}
                  <Route path="/fruit-finder" element={<Index />} /> {/* Placeholder for Fruit Finder page */}
                  <Route path="/about" element={<Index />} /> {/* Placeholder for About page */}
                  <Route path="/seasonal" element={<Index />} /> {/* Placeholder for Seasonal page */}
                  <Route path="/contact" element={<Index />} /> {/* Placeholder for Contact page */}
                  <Route path="/faq" element={<Index />} /> {/* Placeholder for FAQ page */}
                  <Route path="/shipping" element={<Index />} /> {/* Placeholder for Shipping page */}
                  <Route path="/returns" element={<Index />} /> {/* Placeholder for Returns page */}
                  <Route path="/privacy" element={<Index />} /> {/* Placeholder for Privacy page */}
                  <Route path="/wishlist" element={<Wishlist />} />
                  
                  {/* Admin Login Route */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  
                  {/* Protected Admin Routes */}
                  <Route element={<AdminRouteGuard />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/orders/:id" element={<OrderDetail />} />
                    <Route path="/admin/products" element={<ProductManagement />} />
                    <Route path="/admin/products/add" element={<AddProduct />} />
                    <Route path="/admin/products/edit/:id" element={<EditProduct />} />
                    <Route path="/admin/customers" element={<CustomerManagement />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </AdminAuthProvider>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
