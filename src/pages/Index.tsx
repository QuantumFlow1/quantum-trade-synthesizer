
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginComponent } from "@/components/auth/LoginComponent";
import { useToast } from "@/hooks/use-toast";
import AdminPanel from "@/components/AdminPanel";
import UserDashboard from "@/components/UserDashboard";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [scale, setScale] = useState(1);
  const [isPinching, setIsPinching] = useState(false);
  const [startTouchDistance, setStartTouchDistance] = useState(0);

  // Gesture controls
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        setStartTouchDistance(distance);
        setIsPinching(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isPinching && e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const scaleDiff = distance / startTouchDistance;
        const newScale = Math.min(Math.max(0.5, scale * scaleDiff), 2);
        setScale(newScale);
      }
    };

    const handleTouchEnd = () => {
      setIsPinching(false);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.001), 2);
        setScale(newScale);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [scale, isPinching, startTouchDistance]);

  // Handle hash fragment for OAuth redirects
  useEffect(() => {
    let isSubscribed = true;

    const handleHashFragment = async () => {
      if (!isSubscribed) return;

      const currentUrl = window.location.href;
      const hasHash = window.location.hash;
      const searchParams = window.location.search;

      if (hasHash || searchParams) {
        const hasError = searchParams.includes('error');
        if (hasError) {
          const params = new URLSearchParams(searchParams);
          const errorDescription = params.get('error_description');
          if (isSubscribed) {
            toast({
              title: "Authenticatie Error",
              description: errorDescription?.replace(/\+/g, ' ') || "Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.",
              variant: "destructive",
            });
          }
        }
        if (isSubscribed) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };

    handleHashFragment().catch(error => {
      if (isSubscribed) {
        console.error('Error handling hash fragment:', error);
        toast({
          title: "Authenticatie Error",
          description: "Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.",
          variant: "destructive",
        });
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, []); 

  // Controls for zoom
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setScale(1);

  if (!user) {
    return <LoginComponent />;
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Even geduld...</h1>
          <p className="text-muted-foreground">
            Je profiel wordt geladen.
          </p>
        </div>
      </div>
    );
  }

  if (userProfile.role === 'admin' || userProfile.role === 'super_admin') {
    return <AdminPanel />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Zoom Controls */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleResetZoom}
          className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
        >
          {scale !== 1 ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Content with Scale Transform */}
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
            <UserDashboard />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Index;
