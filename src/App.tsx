
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { LanguageSelector } from "./components/auth/LanguageSelector";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Overview from "./pages/admin/dashboard/Overview";
import Users from "./pages/admin/dashboard/Users";
import System from "./pages/admin/dashboard/System";
import Finance from "./pages/admin/dashboard/Finance";
import AdminPanel from "./components/AdminPanel";
import { useAuth } from "./components/auth/AuthProvider";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Admin Route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, userProfile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user || userProfile?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { userProfile } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      <Route path="/admin/dashboard/overview" element={<AdminRoute><Overview /></AdminRoute>} />
      <Route path="/admin/dashboard/users" element={<AdminRoute><Users /></AdminRoute>} />
      <Route path="/admin/dashboard/system" element={<AdminRoute><System /></AdminRoute>} />
      <Route path="/admin/dashboard/finance" element={<AdminRoute><Finance /></AdminRoute>} />
      {/* Voeg taalkeuzebalk toe aan elke pagina */}
      <Route path="/auth/callback/*" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <div className="min-h-screen flex w-full">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="fixed top-4 right-4 z-50">
              <LanguageSelector 
                value={localStorage.getItem('preferred_language') as any || 'nl'} 
                onValueChange={(lang) => {
                  localStorage.setItem('preferred_language', lang);
                  window.location.reload();
                }}
              />
            </div>
            <AppRoutes />
          </BrowserRouter>
        </div>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
