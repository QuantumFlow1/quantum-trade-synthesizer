
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export function useWebGLState() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [restoreAttempts, setRestoreAttempts] = useState(0);
  
  // Check for WebGL availability
  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        
        // Fix type error: explicitly type gl as WebGL2RenderingContext | WebGLRenderingContext | null
        let gl: WebGL2RenderingContext | WebGLRenderingContext | null = canvas.getContext('webgl2', { 
          failIfMajorPerformanceCaveat: false,
          powerPreference: 'high-performance'
        });
        
        // Fall back to WebGL1
        if (!gl) {
          gl = canvas.getContext('webgl', { 
            failIfMajorPerformanceCaveat: false,
            powerPreference: 'high-performance'
          }) as WebGLRenderingContext | null; 
          
          if (!gl) {
            gl = canvas.getContext('experimental-webgl', { 
              failIfMajorPerformanceCaveat: false,
              powerPreference: 'high-performance'
            }) as WebGLRenderingContext | null;
          }
        }
        
        if (gl) {
          // Basic rendering test to ensure WebGL works
          try {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            console.log("WebGL is available and working properly");
            setWebGLAvailable(true);
            setHasError(false);
          } catch (renderError) {
            console.error("WebGL rendering test failed:", renderError);
            setWebGLAvailable(false);
            setHasError(true);
          }
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
  
  // Loading state management
  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
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
      description: "WebGL context was lost. Attempting to recover...",
      variant: "destructive",
    });
    
    // Progressive backoff for restoration attempts
    const newAttempts = restoreAttempts + 1;
    setRestoreAttempts(newAttempts);
    
    // Auto-retry with increasing delays
    if (newAttempts < 3) {
      const backoffTime = Math.min(1000 * Math.pow(1.5, newAttempts), 5000);
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
    
    // Force a new WebGL context
    try {
      const canvas = document.createElement('canvas');
      // Fix type error by explicitly typing gl as WebGL2RenderingContext | WebGLRenderingContext | null
      const gl: WebGL2RenderingContext | WebGLRenderingContext | null = 
                 canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) || 
                 canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false });
                 
      if (gl) {
        setWebGLAvailable(true);
        console.log("WebGL retry succeeded");
      } else {
        setWebGLAvailable(false);
        console.log("WebGL retry failed - not available");
      }
    } catch (e) {
      console.error("WebGL retry check failed:", e);
      setWebGLAvailable(false);
    }
    
    // Reset loading state after a delay
    setTimeout(() => setIsLoading(false), 1000);
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
