
import React, { Suspense } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginComponent } from "@/components/auth/LoginComponent";
import AdminPanel from "@/components/AdminPanel";
import UserDashboard from "@/components/UserDashboard";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { motion, AnimatePresence } from "framer-motion";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { useOAuthRedirect } from "@/hooks/use-oauth-redirect";
import { ZoomControls } from "@/components/ZoomControls";
import { LoadingProfile } from "@/components/LoadingProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { checkSupabaseConnection } from "@/lib/supabase";
import { SuperAdminVoiceAssistant } from "@/components/admin/SuperAdminVoiceAssistant";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  useOAuthRedirect();

  // Check Supabase connection when component mounts
  React.useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        toast({
          title: "Connectie probleem",
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

  const isSuperAdmin = userProfile.role === 'super_admin';

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
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
              {/* Show SuperAdminVoiceAssistant for super admins */}
              {isSuperAdmin && <SuperAdminVoiceAssistant />}
              
              {/* Regular voice assistant for everyone */}
              <VoiceAssistant />
              
              {userProfile.role === 'admin' || userProfile.role === 'super_admin' ? (
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
