
import { useState, useEffect, useCallback } from "react";

export function useWebGLState() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [restoreAttempts, setRestoreAttempts] = useState(0);
  
  // Check for WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      
      // First try to get a WebGL2 context which is more stable
      let gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
      
      // Fall back to WebGL1 if WebGL2 is not available
      if (!gl) {
        gl = canvas.getContext('webgl') as WebGLRenderingContext | null || 
             canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      }
      
      if (gl) {
        // Check for required extensions
        const extensions = [
          'OES_texture_float',
          'OES_texture_float_linear',
          'OES_standard_derivatives'
        ];
        
        const missingExtensions = extensions.filter(ext => !gl!.getExtension(ext));
        
        if (missingExtensions.length > 0) {
          console.warn("Some WebGL extensions are missing:", missingExtensions);
        }
        
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
  }, []);
  
  // Loading state timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle WebGL context loss
  const handleContextLost = useCallback(() => {
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
    setContextLost(false);
    // Wait a moment before clearing the error state
    setTimeout(() => setHasError(false), 800);
  }, []);
  
  // Reset visualization state and retry rendering
  const handleRetry = useCallback(() => {
    setContextLost(false);
    setHasError(false);
    setIsLoading(true);
    
    // Force WebGL context check again
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null || 
                 canvas.getContext('webgl') as WebGLRenderingContext | null || 
                 canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      setWebGLAvailable(!!gl);
    } catch (e) {
      console.error("WebGL retry check failed:", e);
      setWebGLAvailable(false);
    }
    
    setTimeout(() => setIsLoading(false), 2000);
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
