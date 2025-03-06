
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { EnvironmentProvider } from "./contexts/EnvironmentContext";
import { ErrorBoundary } from "react-error-boundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Overview from "./pages/admin/dashboard/Overview";
import Users from "./pages/admin/dashboard/Users";
import System from "./pages/admin/dashboard/System";
import Finance from "./pages/admin/dashboard/Finance";
import AdminPanel from "./components/AdminPanel";
import ChatPage from "./pages/chat";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-6 max-w-sm mx-auto bg-card rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-foreground mb-4">Something went wrong</h2>
        <pre className="text-sm text-muted-foreground overflow-auto">
          {error.message}
        </pre>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <EnvironmentProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/dashboard/overview" element={<Overview />} />
                <Route path="/admin/dashboard/users" element={<Users />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/dashboard/system" element={<System />} />
                <Route path="/admin/dashboard/finance" element={<Finance />} />
                <Route path="/auth/callback/*" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </EnvironmentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
