
import React, { Suspense, useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginComponent } from "@/components/auth/LoginComponent";
import AdminPanel from "@/components/AdminPanel";
import UserDashboard from "@/components/UserDashboard";
import { motion, AnimatePresence } from "framer-motion";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { useOAuthRedirect } from "@/hooks/use-oauth-redirect";
import { ZoomControls } from "@/components/ZoomControls";
import { LoadingProfile } from "@/components/LoadingProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { setupFirebaseErrorHandling } from "@/utils/firebase-error-handler";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');
  const [dashboardPage, setDashboardPage] = React.useState("overview");
  const [renderError, setRenderError] = useState<string | null>(null);
  
  useOAuthRedirect();

  // Setup Firebase error handling
  useEffect(() => {
    setupFirebaseErrorHandling();
  }, []);

  // Error boundary effect
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Caught runtime error:", error);
      setRenderError(error.message || "An unexpected error occurred");
      
      toast({
        title: "Application Error",
        description: "We encountered an issue loading the dashboard. Please try refreshing the page.",
        variant: "destructive",
      });
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [toast]);

  // Expose dashboard navigation handler to window for cross-component communication
  React.useEffect(() => {
    (window as any).__dashboardNavigationHandler = setDashboardPage;
    
    return () => {
      delete (window as any).__dashboardNavigationHandler;
    };
  }, []);

  // Show loading screen while fetching profile
  if (user && !userProfile) {
    return <LoadingProfile />;
  }

  // If we have a render error, show an error component
  if (renderError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            <p className="mb-2">The application failed to load properly. This might be due to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Network connectivity issues</li>
              <li>API key configuration problems</li>
              <li>Temporary service disruption</li>
            </ul>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Refresh Page
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Helper function to determine if user is a super admin
  const isSuperAdmin = userProfile?.role === "super_admin" || userProfile?.role === "lov_trader";
  const isAdmin = userProfile?.role === "admin" || isSuperAdmin;

  return (
    <TooltipProvider>
      <div className="w-full min-h-screen bg-background">
        {!user ? (
          <LoginComponent />
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
              className="h-full w-full"
            >
              {/* Quick Links for authenticated users */}
              <div className="fixed top-4 right-4 z-50 flex gap-2">
                {/* Users Dashboard Link - Only shown to admins */}
                {isAdmin && (
                  <Link to="/admin/users">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Gebruikers</span>
                    </Button>
                  </Link>
                )}
              </div>
              
              {isSuperAdmin ? (
                <AdminPanel key="admin-panel" />
              ) : userProfile?.role === "admin" ? (
                <AdminPanel key="admin-panel" />
              ) : (
                <UserDashboard key="user-dashboard" />
              )}
              {!isMobile && <ZoomControls
                scale={scale}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetZoom={handleResetZoom}
              />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </TooltipProvider>
  );
};

export default Index;
