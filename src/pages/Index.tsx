
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
import { useMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const isMobile = useMobile();
  useOAuthRedirect();

  if (!user) {
    return <LoginComponent />;
  }

  if (!userProfile) {
    return <LoadingProfile />;
  }

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
            <VoiceAssistant />
            {userProfile.role === 'admin' || userProfile.role === 'super_admin' ? (
              <AdminPanel />
            ) : (
              <UserDashboard />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Index;
