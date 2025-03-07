
import { useState, useEffect, useCallback } from "react";

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
        
        // First try to get a WebGL2 context which is more stable
        let gl: WebGL2RenderingContext | WebGLRenderingContext | null = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
        
        // Fall back to WebGL1 if WebGL2 is not available
        if (!gl) {
          gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) as WebGLRenderingContext | null || 
               canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false }) as WebGLRenderingContext | null;
        }
        
        if (gl) {
          // Check for required extensions (but don't fail if they're missing)
          const extensions = [
            'OES_texture_float',
            'OES_texture_float_linear',
            'OES_standard_derivatives'
          ];
          
          // Basic rendering test
          try {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
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
    
    // Run check on mount
    checkWebGLSupport();
    
    // Add listening for visibilitychange to re-check WebGL when tab becomes visible again
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
  
  // Loading state timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Reduce to 1 second for faster initial rendering
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle WebGL context loss
  const handleContextLost = useCallback(() => {
    console.error("WebGL context lost detected in hook");
    setContextLost(true);
    setHasError(true);
    
    // Increment restore attempts
    setRestoreAttempts(prev => prev + 1);
    
    // Progressive backoff for restoration attempts
    const backoffTime = Math.min(1000 * Math.pow(1.5, restoreAttempts), 8000);
    
    // Try to restore after backoff
    if (restoreAttempts < 3) {
      setTimeout(() => {
        handleRetry();
      }, backoffTime);
    } else {
      console.error("Maximum WebGL restore attempts reached");
    }
  }, [restoreAttempts]);
  
  // Handle WebGL context restoration
  const handleContextRestored = useCallback(() => {
    console.log("WebGL context restored detected in hook");
    setContextLost(false);
    // Wait a moment before clearing the error state
    setTimeout(() => setHasError(false), 500);
  }, []);
  
  // Reset visualization state and retry rendering
  const handleRetry = useCallback(() => {
    setContextLost(false);
    setHasError(false);
    setIsLoading(true);
    setRestoreAttempts(0);
    
    // Force WebGL context check again
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) || 
                 canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) || 
                 canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false });
                 
      if (gl) {
        setWebGLAvailable(true);
      } else {
        setWebGLAvailable(false);
      }
    } catch (e) {
      console.error("WebGL retry check failed:", e);
      setWebGLAvailable(false);
    }
    
    // Reset loading state after a shorter delay
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
