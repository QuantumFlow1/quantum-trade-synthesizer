
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
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Globe } from "lucide-react";

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
  
  if (!user || (userProfile?.role !== 'admin' && userProfile?.role !== 'super_admin')) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { userProfile } = useAuth();
  const currentLanguage = localStorage.getItem('preferred_language') as any || 'nl';
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const translations = {
    nl: {
      showLanguage: "Taal wijzigen",
      hideLanguage: "Verberg taalkeuze"
    },
    en: {
      showLanguage: "Change language",
      hideLanguage: "Hide language selector"
    },
    ru: {
      showLanguage: "Изменить язык",
      hideLanguage: "Скрыть выбор языка"
    },
    hy: {
      showLanguage: "Փոխել լեզուն",
      hideLanguage: "Թաքցնել լեզվի ընտրությունը"
    }
  };

  const getText = (key: keyof typeof translations.nl) => {
    return translations[currentLanguage]?.[key] || translations.en[key];
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      <Route path="/admin/dashboard/overview" element={<AdminRoute><Overview /></AdminRoute>} />
      <Route path="/admin/dashboard/users" element={<AdminRoute><Users /></AdminRoute>} />
      <Route path="/admin/dashboard/system" element={<AdminRoute><System /></AdminRoute>} />
      <Route path="/admin/dashboard/finance" element={<AdminRoute><Finance /></AdminRoute>} />
      <Route path="/auth/callback/*" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const currentLanguage = localStorage.getItem('preferred_language') as any || 'nl';

  const translations = {
    nl: {
      showLanguage: "Taal wijzigen",
      hideLanguage: "Verberg taalkeuze"
    },
    en: {
      showLanguage: "Change language",
      hideLanguage: "Hide language selector"
    },
    ru: {
      showLanguage: "Изменить язык",
      hideLanguage: "Скрыть выбор языка"
    },
    hy: {
      showLanguage: "Փոխել լեզուն",
      hideLanguage: "Թաքցնել լեզվի ընտրությունը"
    }
  };

  const getText = (key: keyof typeof translations.nl) => {
    return translations[currentLanguage]?.[key] || translations.en[key];
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <div className="min-h-screen flex w-full">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                >
                  <Globe className="h-4 w-4" />
                  {showLanguageSelector ? getText('hideLanguage') : getText('showLanguage')}
                </Button>
                {showLanguageSelector && (
                  <div className="bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                    <LanguageSelector 
                      value={localStorage.getItem('preferred_language') as any || 'nl'} 
                      onValueChange={(lang) => {
                        localStorage.setItem('preferred_language', lang);
                        window.location.reload();
                      }}
                    />
                  </div>
                )}
              </div>
              <AppRoutes />
            </BrowserRouter>
          </div>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
