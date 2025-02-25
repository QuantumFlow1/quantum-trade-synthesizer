
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
import { EdriziAIAssistant } from "@/components/voice-assistant/EdriziAIAssistant";

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
            title: "Verbinding geslaagd",
            description: "De connectie met het systeem is succesvol opgezet.",
            variant: "default"
          });
        } else {
          setConnectionStatus('error');
          toast({
            title: "Beperkte verbinding",
            description: "Sommige functies zijn mogelijk beperkt beschikbaar. Probeer later opnieuw.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Connection check error:", error);
        setConnectionStatus('error');
        toast({
          title: "Verbinding probleem",
          description: "Er is een probleem met de verbinding. Probeer de pagina te verversen.",
          variant: "destructive"
        });
      }
    };
    
    checkConnection();
  }, [toast]);

  if (!user) {
    return <LoginComponent />;
  }

  if (!userProfile) {
    return <LoadingProfile />;
  }

  const isAdminUser = userProfile.role === 'admin' || userProfile.role === 'super_admin';
  
  // For debugging
  console.log("User role:", userProfile.role);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {connectionStatus === 'error' && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-destructive/90 text-white p-2 text-center text-sm">
          Beperkte verbinding. Sommige functies zijn mogelijk niet beschikbaar.
        </div>
      )}
      
      {!isMobile && (
        <ZoomControls
          scale={scale}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetZoom}
        />
      )}

      <motion.div
        className="container mx-auto px-4 py-4 sm:p-4"
        style={{ 
          scale: isMobile ? 1 : scale,
          transition: "scale 0.2s ease-out"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6"
          >
            <Suspense fallback={<div>Loading...</div>}>
              {/* EdriziAI Assistant for all users */}
              <EdriziAIAssistant />
              
              {isAdminUser ? (
                <AdminPanel />
              ) : (
                <UserDashboard />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Index;
