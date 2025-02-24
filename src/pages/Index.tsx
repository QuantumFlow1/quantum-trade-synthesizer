
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

const Index = () => {
  const { user, userProfile, isLoading } = useAuth();
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  useOAuthRedirect();

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

  if (isLoading) {
    return <LoadingProfile />;
  }

  if (!user) {
    return <LoginComponent />;
  }

  if (!userProfile) {
    return <LoadingProfile />;
  }

  const DashboardComponent = userProfile.role === 'admin' || userProfile.role === 'super_admin' 
    ? AdminPanel 
    : UserDashboard;

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
      <DashboardComponent />
    </div>
  );
};

export default Index;
