
import { useCallback, useEffect } from "react";

interface WebGLContextManagerProps {
  onContextLost: () => void;
  onContextRestored: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const WebGLContextManager = ({
  onContextLost,
  onContextRestored,
  canvasRef
}: WebGLContextManagerProps) => {
  const handleContextLost = useCallback((event: Event) => {
    console.error("WebGL context lost event triggered");
    event.preventDefault(); // Standard practice to allow recovery
    onContextLost();
  }, [onContextLost]);
  
  const handleContextRestored = useCallback((event: Event) => {
    console.log("WebGL context restored event triggered");
    event.preventDefault(); // Prevent default behavior
    onContextRestored();
  }, [onContextRestored]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    
    if (canvas) {
      // Add event listeners with properly typed event handlers
      canvas.addEventListener('webglcontextlost', handleContextLost as EventListener);
      canvas.addEventListener('webglcontextrestored', handleContextRestored as EventListener);
      
      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLost as EventListener);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored as EventListener);
      };
    }
  }, [canvasRef, handleContextLost, handleContextRestored]);
  
  return null;
};
