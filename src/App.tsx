import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Check Supabase connection on startup
    const checkSupabaseConnection = async () => {
      try {
        const { error } = await supabase
          .from("waiting_list")
          .select("*", { count: "exact", head: true });
        
        if (error) {
          console.error("❌ Supabase Waiting List Ready: NE");
          console.error("Error:", error.message);
        } else {
          console.log("✅ Supabase Waiting List Ready: DA");
          console.log("📊 Project ID: zolatilgpfamhzlqgsjc");
          console.log("🔗 Connected to: https://zolatilgpfamhzlqgsjc.supabase.co");
        }
      } catch (err) {
        console.error("❌ Supabase Waiting List Ready: NE");
        console.error("Connection error:", err);
      }
    };

    checkSupabaseConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
