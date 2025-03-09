
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Import components lazily
const Index = lazy(() => import("@/pages/Index"));
const Market = lazy(() => import("@/pages/Market"));
const Trading = lazy(() => import("@/pages/Trading"));
const Settings = lazy(() => import("@/pages/Settings"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Wallet = lazy(() => import("@/pages/Wallet"));
const StockBot = lazy(() => import("@/pages/StockBot"));

// Loading component
const LazyLoadingComponent = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Suspense fallback={<LazyLoadingComponent />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/market" element={<Market />} />
              <Route path="/trading" element={<Trading />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/stockbot" element={<StockBot />} />
            </Routes>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
