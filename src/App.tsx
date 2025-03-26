
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Index />} /> {/* Placeholder for Shop page */}
          <Route path="/product/:id" element={<Index />} /> {/* Placeholder for Product page */}
          <Route path="/cart" element={<Index />} /> {/* Placeholder for Cart page */}
          <Route path="/checkout" element={<Index />} /> {/* Placeholder for Checkout page */}
          <Route path="/account" element={<Index />} /> {/* Placeholder for Account page */}
          <Route path="/fruit-finder" element={<Index />} /> {/* Placeholder for Fruit Finder page */}
          <Route path="/subscription" element={<Index />} /> {/* Placeholder for Subscription page */}
          <Route path="/about" element={<Index />} /> {/* Placeholder for About page */}
          <Route path="/seasonal" element={<Index />} /> {/* Placeholder for Seasonal page */}
          <Route path="/contact" element={<Index />} /> {/* Placeholder for Contact page */}
          <Route path="/faq" element={<Index />} /> {/* Placeholder for FAQ page */}
          <Route path="/shipping" element={<Index />} /> {/* Placeholder for Shipping page */}
          <Route path="/returns" element={<Index />} /> {/* Placeholder for Returns page */}
          <Route path="/privacy" element={<Index />} /> {/* Placeholder for Privacy page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
