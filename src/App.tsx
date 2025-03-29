
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IndexPage from "./pages";
import UserDashboard from "./components/UserDashboard";
import AdminPanel from "./components/AdminPanel";
import ChatPage from "./pages/chat";
import ResearchPage from "./pages/ResearchPage"; // Fixed import path
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/components/auth/AuthProvider";
import { setupFirebaseErrorHandling } from "@/utils/firebase-error-handler";
import SubscriptionPage from "./pages/subscription";
import { OnboardingProvider } from "./contexts/OnboardingContext";

const App = () => {
  const { user, userProfile } = useAuth();
  const [connectionStatus, setConnectionStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');
  const [dashboardPage, setDashboardPage] = React.useState("overview");
  const [renderError, setRenderError] = useState<string | null>(null);

  // Setup Firebase error handling
  useEffect(() => {
    setupFirebaseErrorHandling();
  }, []);
  
  return (
    <Router>
      <OnboardingProvider>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/dashboard/*" element={<UserDashboard />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </OnboardingProvider>
    </Router>
  );
};

export default App;
