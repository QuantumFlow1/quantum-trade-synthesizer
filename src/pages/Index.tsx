
import React, { Suspense, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginComponent } from "@/components/auth/LoginComponent";
import { AnimatePresence } from "framer-motion";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { useOAuthRedirect } from "@/hooks/use-oauth-redirect";
import { LoadingProfile } from "@/components/LoadingProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { AuthenticatedContent } from "@/components/dashboard/AuthenticatedContent";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  useOAuthRedirect();

  // Debug user profile
  useEffect(() => {
    if (user) {
      console.log("Current user:", user);
      console.log("User profile:", userProfile);
      console.log("User role:", userProfile?.role);
      
      toast({
        title: "User profile info",
        description: `Role: ${userProfile?.role || 'Loading...'}`,
        duration: 5000,
      });
    }
  }, [user, userProfile, toast]);

  // Show loading screen while fetching profile
  if (user && !userProfile) {
    return <LoadingProfile />;
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {!user ? (
        <LoginComponent />
      ) : (
        <AnimatePresence>
          <AuthenticatedContent
            userProfile={userProfile}
            scale={scale}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleResetZoom={handleResetZoom}
            isMobile={isMobile}
          />
        </AnimatePresence>
      )}
    </div>
  );
};

export default Index;
