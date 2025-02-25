
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
import { SuperAdminVoiceAssistant } from "@/components/admin/SuperAdminVoiceAssistant";
import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
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
            title: "Verbinding geslaagd",
            description: "Verbinding met Supabase is succesvol tot stand gebracht."
          });
        } else {
          setConnectionStatus('error');
          toast({
            title: "Verbinding mislukt",
            description: "Kan geen verbinding maken met Supabase, probeer het later opnieuw.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Fout bij het controleren van de verbinding:", error);
        setConnectionStatus('error');
        toast({
          title: "Verbinding mislukt",
          description: "Er is een fout opgetreden bij het controleren van de verbinding.",
          variant: "destructive",
        });
      }
    };
    
    checkConnection();
  }, [toast]);

  // Show loading screen while fetching profile
  if (user && !userProfile) {
    return <LoadingProfile />;
  }

  // Helper function to determine if user is a super admin
  const isSuperAdmin = userProfile?.role === "super_admin" || userProfile?.role === "lov_trader";

  return (
    <div className="w-full min-h-screen bg-background">
      {!user ? (
        <LoginComponent />
      ) : (
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}>
          {/* Grok Chat Link - shown to authenticated users */}
          {user && (
            <div className="fixed top-4 right-4 z-50">
              <Link to="/chat">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span>Grok Chat</span>
                </Button>
              </Link>
            </div>
          )}
          
          {isSuperAdmin ? (
            <>
              <AdminPanel />
              <SuperAdminVoiceAssistant />
            </>
          ) : userProfile?.role === "admin" ? (
            <AdminPanel />
          ) : (
            <>
              <UserDashboard />
              <EdriziAIAssistant />
            </>
          )}
          {!isMobile && <ZoomControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
          />}
        </div>
      )}
    </div>
  );
};

export default Index;
