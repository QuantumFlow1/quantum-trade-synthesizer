
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";

export function useWebGLState() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [restoreAttempts, setRestoreAttempts] = useState(0);
  const initialCheckDone = useRef(false);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  
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
  
  // Track loading time to detect potential hangs
  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      
      // Update loading time every second
      loadingTimerRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current;
        setLoadingTime(elapsedTime);
        
        // Auto-retry after 10 seconds if still loading
        if (elapsedTime > 10000 && webGLAvailable && !hasError && !contextLost) {
          console.warn("WebGL initialization taking too long, auto-retrying...");
          handleRetry();
        }
      }, 1000);
      
      return () => {
        if (loadingTimerRef.current) {
          clearInterval(loadingTimerRef.current);
        }
      };
    } else if (loadingTimerRef.current) {
      clearInterval(loadingTimerRef.current);
    }
  }, [isLoading, webGLAvailable, hasError, contextLost]);
  
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
    setRestoreAttempts(prev => prev + 1);
    setLoadingTime(0);
    startTimeRef.current = Date.now();
    
    // Reset loading state after a minimal delay
    setTimeout(() => setIsLoading(false), 100);
  }, []);
  
  return {
    isLoading,
    hasError,
    webGLAvailable,
    contextLost,
    loadingTime,
    handleContextLost,
    handleContextRestored,
    handleRetry,
    setIsLoading
  };
}
