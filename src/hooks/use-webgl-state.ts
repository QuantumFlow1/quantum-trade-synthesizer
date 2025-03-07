
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export function useWebGLState() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [restoreAttempts, setRestoreAttempts] = useState(0);
  
  // Check for WebGL availability - optimized for faster checks
  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        
        // Try WebGL2 first with fallbacks to WebGL1
        let gl = canvas.getContext('webgl2') || 
                canvas.getContext('webgl') || 
                canvas.getContext('experimental-webgl');
        
        if (gl) {
          console.log("WebGL is available");
          setWebGLAvailable(true);
          setHasError(false);
        } else {
          console.error("WebGL is not available in this browser");
          setWebGLAvailable(false);
          setHasError(true);
        }
      } catch (e) {
        console.error("Error checking WebGL support:", e);
        setWebGLAvailable(false);
        setHasError(true);
      }
    };
    
    // Check WebGL support on mount
    checkWebGLSupport();
    
    // Re-check when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkWebGLSupport();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Loading state management - significantly reduced delay for faster loading
  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 250); // Reduced from 500ms to 250ms
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle WebGL context loss
  const handleContextLost = useCallback(() => {
    console.error("WebGL context lost detected in hook");
    setContextLost(true);
    setHasError(true);
    
    // Show toast to user
    toast({
      title: "3D Visualization Issue",
      description: "WebGL context was lost. Try refreshing the page.",
      variant: "destructive",
    });
    
    // Progressive backoff for restoration attempts
    const newAttempts = restoreAttempts + 1;
    setRestoreAttempts(newAttempts);
    
    // Auto-retry with increasing delays
    if (newAttempts < 2) {
      const backoffTime = Math.min(1000 * Math.pow(1.5, newAttempts), 2000);
      setTimeout(() => {
        handleRetry();
      }, backoffTime);
    }
  }, [restoreAttempts]);
  
  // Handle WebGL context restoration
  const handleContextRestored = useCallback(() => {
    console.log("WebGL context restored");
    setContextLost(false);
    setHasError(false);
    setRestoreAttempts(0);
    
    // Notify user
    toast({
      title: "3D View Restored",
      description: "Visualization has been successfully restored.",
    });
  }, []);
  
  // Manual retry function for user-initiated recovery
  const handleRetry = useCallback(() => {
    setContextLost(false);
    setHasError(false);
    setIsLoading(true);
    setRestoreAttempts(0);
    
    // Reset loading state after a minimal delay
    setTimeout(() => setIsLoading(false), 300); // Reduced from 600ms to 300ms
  }, []);
  
  return {
    isLoading,
    hasError,
    webGLAvailable,
    contextLost,
    handleContextLost,
    handleContextRestored,
    handleRetry
  };
}
