
import { useCallback, useEffect, useRef } from "react";

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
  
  const handleContextRestored = useCallback(() => {
    console.log("WebGL context restored event triggered");
    onContextRestored();
  }, [onContextRestored]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost, false);
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
      
      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      };
    }
  }, [canvasRef, handleContextLost, handleContextRestored]);
  
  return null;
};
