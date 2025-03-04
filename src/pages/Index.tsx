
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
import { checkSupabaseConnection } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Users, AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = React.useState<'checking' | 'connected' | 'error' | 'offline'>('checking');
  const [isRetrying, setIsRetrying] = React.useState(false);
  
  useOAuthRedirect();

  // Check if we're in offline/local development mode
  const isOfflineMode = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        !navigator.onLine;

  // Check Supabase connection when component mounts
  React.useEffect(() => {
    if (isOfflineMode) {
      setConnectionStatus('offline');
      return;
    }
    checkConnection();
  }, [isOfflineMode]);
  
  const checkConnection = async () => {
    if (isOfflineMode) {
      setConnectionStatus('offline');
      return;
    }
    
    try {
      setConnectionStatus('checking');
      setIsRetrying(true);
      
      const isConnected = await checkSupabaseConnection();
      
      if (isConnected) {
        setConnectionStatus('connected');
        toast({
          title: "Connection successful",
          description: "Connected to the backend services successfully."
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection issues",
          description: "Some backend services are unavailable. Basic functionality may still work.",
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
    } finally {
      setIsRetrying(false);
    }
  };

  // Show loading screen while fetching profile
  if (user && !userProfile) {
    return <LoadingProfile />;
  }

  // Helper function to determine if user is a super admin
  const isSuperAdmin = userProfile?.role === "super_admin" || userProfile?.role === "lov_trader";
  const isAdmin = userProfile?.role === "admin" || isSuperAdmin;

  return (
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
            {/* Connection status alert */}
            {connectionStatus === 'error' && (
              <Alert variant="destructive" className="max-w-md mx-auto mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Connection Issues</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>Some backend services are currently unavailable. Basic functionality may still work.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={checkConnection}
                    disabled={isRetrying}
                    className="mt-2"
                  >
                    {isRetrying ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Checking connection...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry connection
                      </>
                    )}
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {/* Offline mode indicator */}
            {connectionStatus === 'offline' && (
              <Alert variant="warning" className="max-w-md mx-auto mt-4">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Offline Mode</AlertTitle>
                <AlertDescription>
                  Running in offline/local development mode. Some features requiring backend services will be limited.
                </AlertDescription>
              </Alert>
            )}
            
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
  );
};

export default Index;
