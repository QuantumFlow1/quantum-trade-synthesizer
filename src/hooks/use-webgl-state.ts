
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";

export function useWebGLState() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [restoreAttempts, setRestoreAttempts] = useState(0);
  const initialCheckDone = useRef(false);
  
  // Check for WebGL availability - one-time fast check
  useEffect(() => {
    if (initialCheckDone.current) return;
    
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        
        // Try WebGL2 first with fallback to WebGL1
        let gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) || 
                canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) || 
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
        
        initialCheckDone.current = true;
      } catch (e) {
        console.error("Error checking WebGL support:", e);
        setWebGLAvailable(false);
        setHasError(true);
        initialCheckDone.current = true;
      }
    };
    
    // Check WebGL support immediately
    checkWebGLSupport();
  }, []);
  
  // Loading state management - significantly reduced delay for ultra-fast loading
  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 150); // Reduced from 250ms to 150ms
    
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
      description: "WebGL context was lost. Trying to recover automatically...",
      variant: "destructive",
    });
    
    // Progressive backoff for restoration attempts
    const newAttempts = restoreAttempts + 1;
    setRestoreAttempts(newAttempts);
    
    // Auto-retry with fast recovery for first attempt
    if (newAttempts < 3) {
      const backoffTime = newAttempts === 1 ? 200 : Math.min(1000 * Math.pow(1.5, newAttempts - 1), 2000);
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
    
    // Notify user only if there were multiple attempts
    if (restoreAttempts > 1) {
      toast({
        title: "3D View Restored",
        description: "Visualization has been successfully restored.",
      });
    }
  }, [restoreAttempts]);
  
  // Manual retry function for user-initiated recovery
  const handleRetry = useCallback(() => {
    setContextLost(false);
    setHasError(false);
    setIsLoading(true);
    setRestoreAttempts(0);
    
    // Reset loading state after a minimal delay
    setTimeout(() => setIsLoading(false), 200); // Reduced from 300ms to 200ms
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
