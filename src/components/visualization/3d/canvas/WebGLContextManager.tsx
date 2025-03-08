
import { useCallback, useEffect, useRef } from "react";

interface WebGLContextManagerProps {
  onContextLost: () => void;
  onContextRestored: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoTextureEnabled?: boolean;
}

export const WebGLContextManager = ({
  onContextLost,
  onContextRestored,
  canvasRef,
  videoTextureEnabled = false
}: WebGLContextManagerProps) => {
  const eventsAttachedRef = useRef(false);
  const videoTexturesRef = useRef<Set<HTMLVideoElement>>(new Set());
  
  const handleContextLost = useCallback((event: Event) => {
    console.error("WebGL context lost event triggered");
    event.preventDefault(); // Standard practice to allow recovery
    
    // Log WebGL info to help diagnose issues
    try {
      const canvas = canvasRef.current;
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          console.log("WebGL Debug Info:");
          console.log("- Vendor:", gl.getParameter(gl.VENDOR));
          console.log("- Renderer:", gl.getParameter(gl.RENDERER));
          console.log("- Version:", gl.getParameter(gl.VERSION));
          console.log("- Shading Language Version:", gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
          console.log("- Max Texture Size:", gl.getParameter(gl.MAX_TEXTURE_SIZE));
          console.log("- Extensions:", gl.getSupportedExtensions());
        }
      }
    } catch (err) {
      console.warn("Could not log WebGL debug info:", err);
    }
    
    // Pause all video textures when context is lost
    if (videoTextureEnabled && videoTexturesRef.current.size > 0) {
      console.log(`Pausing ${videoTexturesRef.current.size} video textures due to context loss`);
      videoTexturesRef.current.forEach(videoElement => {
        try {
          if (!videoElement.paused) videoElement.pause();
        } catch (err) {
          console.warn("Error pausing video during context loss:", err);
        }
      });
    }
    
    onContextLost();
  }, [onContextLost, videoTextureEnabled, canvasRef]);
  
  const handleContextRestored = useCallback((event: Event) => {
    console.log("WebGL context restored event triggered");
    event.preventDefault(); // Prevent default behavior
    
    // Resume video textures when context is restored
    if (videoTextureEnabled && videoTexturesRef.current.size > 0) {
      console.log(`Resuming ${videoTexturesRef.current.size} video textures after context restoration`);
      videoTexturesRef.current.forEach(videoElement => {
        try {
          if (videoElement.paused && videoElement.autoplay) videoElement.play().catch(e => {
            console.warn("Could not auto-resume video after context restoration:", e);
          });
        } catch (err) {
          console.warn("Error resuming video during context restoration:", err);
        }
      });
    }
    
    onContextRestored();
  }, [onContextRestored, videoTextureEnabled]);
  
  // Register a video element to be managed during context loss/restore
  const registerVideoTexture = useCallback((videoElement: HTMLVideoElement) => {
    if (!videoTextureEnabled) return;
    
    videoTexturesRef.current.add(videoElement);
    console.log(`Video texture registered, total: ${videoTexturesRef.current.size}`);
    
    return () => {
      videoTexturesRef.current.delete(videoElement);
      console.log(`Video texture unregistered, remaining: ${videoTexturesRef.current.size}`);
    };
  }, [videoTextureEnabled]);
  
  // Expose the register function via a ref
  useEffect(() => {
    // Add this to window for external access
    if (videoTextureEnabled) {
      (window as any).__registerVideoTexture = registerVideoTexture;
    }
    
    return () => {
      if (videoTextureEnabled) {
        delete (window as any).__registerVideoTexture;
      }
    };
  }, [registerVideoTexture, videoTextureEnabled]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    
    if (canvas && !eventsAttachedRef.current) {
      try {
        // Add event listeners with properly typed event handlers
        console.log("Attaching WebGL context event listeners");
        canvas.addEventListener('webglcontextlost', handleContextLost as EventListener);
        canvas.addEventListener('webglcontextrestored', handleContextRestored as EventListener);
        
        // Log initial WebGL state
        try {
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            console.log("WebGL is available. Initial context created successfully.");
            console.log("- Vendor:", gl.getParameter(gl.VENDOR));
            console.log("- Renderer:", gl.getParameter(gl.RENDERER));
          } else {
            console.warn("Failed to get WebGL context despite canvas being available");
          }
        } catch (err) {
          console.error("Error checking initial WebGL state:", err);
        }
        
        eventsAttachedRef.current = true;
        
        return () => {
          try {
            console.log("Removing WebGL context event listeners");
            canvas.removeEventListener('webglcontextlost', handleContextLost as EventListener);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored as EventListener);
            eventsAttachedRef.current = false;
          } catch (err) {
            console.warn("Error removing WebGL event listeners:", err);
          }
        };
      } catch (err) {
        console.error("Failed to attach WebGL context event listeners:", err);
      }
    }
  }, [canvasRef, handleContextLost, handleContextRestored]);
  
  return null;
};
