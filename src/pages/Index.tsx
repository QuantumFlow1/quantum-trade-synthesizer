
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
import { Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnvironment } from "@/contexts/EnvironmentContext";

// Mock user progress data
const mockUserProgress = {
  level: 3,
  experience: 2500,
  totalPoints: 2500,
  requiredExperience: 5000,
  completion: {
    total: 15,
    completed: 7
  },
  trades: {
    total: 45,
    profitable: 28
  },
  badges: [
    { id: 'first-trade', name: 'First Trade', icon: '🚀', earnedAt: new Date().toISOString() },
    { id: 'fast-learner', name: 'Fast Learner', icon: '📚', earnedAt: new Date().toISOString() },
    { id: 'early-bird', name: 'Early Bird', icon: '🐦', earnedAt: new Date().toISOString() }
  ],
  activeEnvironment: 'financial-garden'
};

const Index = () => {
  const { user, userProfile } = useAuth();
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');
  
  // Try to use the proper environment context, but fall back to our temp context
  let environmentContext;
  try {
    environmentContext = useEnvironment();
  } catch (e) {
    // Use mock data if the real context provider isn't available
    environmentContext = {
      userProgress: mockUserProgress,
      learningModules: [],
      selectedEnvironment: 'financial-garden',
      setSelectedEnvironment: () => {},
      environments: [],
      currentEnvironment: { id: 'financial-garden', name: 'Financial Garden', description: '', thumbnailIcon: null },
      completeModule: () => {}
    };
  }
  
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
            {/* Quick Links for authenticated users */}
            <div className="fixed top-4 right-4 z-50 flex gap-2">
              {isAdmin && (
                <Link to="/admin/users">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Gebruikers</span>
                  </Button>
                </Link>
              )}
              <Link to="/chat">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Chat</span>
                </Button>
              </Link>
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
