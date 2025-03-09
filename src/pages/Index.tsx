
import React, { Suspense } from "react";
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
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');
  const [dashboardPage, setDashboardPage] = React.useState("overview");
  
  useOAuthRedirect();

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
