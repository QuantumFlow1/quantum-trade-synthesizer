
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { EnvironmentProvider } from "./contexts/EnvironmentContext";
import IndexPage from "./pages/index";
import NotFound from "./pages/NotFound";
import Overview from "./pages/admin/dashboard/Overview";
import Users from "./pages/admin/dashboard/Users";
import System from "./pages/admin/dashboard/System";
import Finance from "./pages/admin/dashboard/Finance";
import AdminPanel from "./components/AdminPanel";
import ChatPage from "./pages/chat";
import UserDashboard from "./components/UserDashboard";
// import OllamaChatPage from "./pages/ollama-chat";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <EnvironmentProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/chat" element={<ChatPage />} />
                {/* Temporarily disabled Ollama chat route */}
                {/* <Route path="/ollama-chat" element={<OllamaChatPage />} /> */}
                <Route path="/ollama-chat" element={<Navigate to="/" replace />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/dashboard/overview" element={<Overview />} />
                <Route path="/admin/dashboard/users" element={<Users />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/dashboard/system" element={<System />} />
                <Route path="/admin/dashboard/finance" element={<Finance />} />
                <Route path="/dashboard/*" element={<UserDashboard />} />
                <Route path="/auth/callback/*" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </EnvironmentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
