
import React, { Suspense } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginComponent } from "@/components/auth/LoginComponent";
import AdminPanel from "@/components/AdminPanel";
import UserDashboard from "@/components/UserDashboard";
import { motion, AnimatePresence } from "framer-motion";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { useOAuthRedirect } from "@/hooks/use-oauth-redirect";
import { ZoomControls } from "@/components/ZoomControls";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LoadingProfile } from "@/components/LoadingProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { checkSupabaseConnection } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');
  
  useOAuthRedirect();

  // Check Supabase connection when component mounts
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('checking');
        const isConnected = await checkSupabaseConnection();
        
        if (isConnected) {
          setConnectionStatus('connected');
          toast({
            title: "Connection successful",
            description: "Successfully connected to backend services."
          });
        } else {
          setConnectionStatus('error');
          toast({
            title: "Connection failed",
            description: "Could not connect to backend services. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error checking connection:", error);
        setConnectionStatus('error');
        toast({
          title: "Connection error",
          description: "An error occurred while checking the connection.",
          variant: "destructive",
        });
      }
    };
    
    checkConnection();
  }, [toast]);

  // Show loading screen while checking connection
  if (connectionStatus === 'checking') {
    return <LoadingScreen />;
  }

  // Show loading screen while fetching profile
  if (user && !userProfile) {
    return <LoadingProfile />;
  }

  // Helper function to determine if user is a super admin
  const isSuperAdmin = userProfile?.role === "super_admin" || userProfile?.role === "lov_trader";
  const isAdmin = userProfile?.role === "admin" || isSuperAdmin;

  return (
    <Suspense fallback={<LoadingScreen />}>
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
                {isAdmin && (
                  <Link to="/admin/users">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Users</span>
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
              
              {!isMobile && (
                <ZoomControls
                  scale={scale}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onResetZoom={handleResetZoom}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </Suspense>
  );
};

export default Index;
