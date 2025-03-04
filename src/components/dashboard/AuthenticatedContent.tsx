
import React from "react";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/auth";
import AdminPanel from "@/components/AdminPanel";
import UserDashboard from "@/components/UserDashboard";
import { ZoomControls } from "@/components/ZoomControls";
import { UserInfoAlert } from "./UserInfoAlert";
import { ConnectionStatusAlerts } from "./ConnectionStatusAlerts";
import { QuickLinks } from "./QuickLinks";
import { useConnectionStatus } from "@/hooks/use-connection-status";

interface AuthenticatedContentProps {
  userProfile: UserProfile | null;
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  isMobile: boolean;
}

export const AuthenticatedContent: React.FC<AuthenticatedContentProps> = ({ 
  userProfile,
  scale,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  isMobile
}) => {
  const { connectionStatus, isRetrying, checkConnection } = useConnectionStatus();
  
  // Helper function to determine if user is an admin
  // Consider both admin and super_admin roles as admin users
  const isAdmin = userProfile?.role === "admin" || 
                   userProfile?.role === "super_admin" ||
                   userProfile?.role === "lov_trader";

  console.log("User profile in AuthenticatedContent:", userProfile);
  console.log("Is admin?", isAdmin);
  
  // If no profile exists but we have a user, show admin panel as fallback (for debugging)
  const showAdminPanel = isAdmin || !userProfile;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
      className="h-full w-full"
    >
      {/* User Role Debug Information */}
      <UserInfoAlert userProfile={userProfile} isAdmin={isAdmin} />
      
      {/* Connection status alerts */}
      <ConnectionStatusAlerts 
        connectionStatus={connectionStatus}
        isRetrying={isRetrying}
        checkConnection={checkConnection}
      />
      
      {/* Quick Links for authenticated users */}
      <QuickLinks isAdmin={isAdmin} />
      
      {showAdminPanel ? (
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
  );
};
