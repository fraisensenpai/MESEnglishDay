import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import OrderEntry from "./pages/OrderEntry";
import KitchenPanel from "./pages/KitchenPanel";
import ScorePanel from "./pages/ScorePanel";
import BoothManagement from "./pages/BoothManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/order-entry" element={<OrderEntry />} />
          <Route path="/kitchen-panel" element={<KitchenPanel />} />
          <Route path="/score-panel" element={<ScorePanel />} />
          <Route path="/booth-management" element={<BoothManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
