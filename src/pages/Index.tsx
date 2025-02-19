
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

const Index = () => {
  const { user, userProfile } = useAuth();
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  useOAuthRedirect();

  if (!user) {
    return <LoginComponent />;
  }

  if (!userProfile) {
    return <LoadingProfile />;
  }

  if (userProfile.role === 'admin' || userProfile.role === 'super_admin') {
    return <AdminPanel />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <ZoomControls
        scale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleResetZoom}
      />

      <motion.div
        className="container mx-auto p-4"
        style={{ 
          scale,
          transition: "scale 0.2s ease-out"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <VoiceAssistant />
            <UserDashboard />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Index;
