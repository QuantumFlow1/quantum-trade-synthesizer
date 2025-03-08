
import { Canvas } from "@react-three/fiber";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";
import { useEffect, useState, useRef } from "react";
import { CanvasContainer } from "./CanvasContainer";
import { WebGLContextManager } from "./WebGLContextManager";
import { CanvasContent } from "./CanvasContent";

interface MarketViewCanvasProps {
  theme: ColorTheme;
  webGLAvailable: boolean;
  hasError: boolean;
  contextLost: boolean;
  isLoading: boolean;
  data: TradingDataPoint[];
  onWebGLContextLost: () => void;
  onWebGLContextRestored: () => void;
}

export const MarketViewCanvas = ({
  theme,
  webGLAvailable,
  hasError,
  contextLost,
  isLoading,
  data,
  onWebGLContextLost,
  onWebGLContextRestored
}: MarketViewCanvasProps) => {
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const [rendererReady, setRendererReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  
  // Debug log to track component lifecycle
  useEffect(() => {
    console.log("MarketViewCanvas mounted with props:", { 
      webGLAvailable, hasError, contextLost, isLoading, dataLength: data.length 
    });
    
    return () => {
      console.log("MarketViewCanvas unmounting");
      mountedRef.current = false;
    };
  }, [webGLAvailable, hasError, contextLost, isLoading, data]);
  
  // Reset states when key props change
  useEffect(() => {
    if (hasError || contextLost) {
      console.log("Resetting canvas initialization due to error or context loss");
      if (mountedRef.current) {
        setCanvasInitialized(false);
        setRendererReady(false);
      }
    }
  }, [hasError, contextLost]);
  
  // Create a new canvas when needed
  useEffect(() => {
    if (webGLAvailable && !contextLost && !hasError) {
      if (mountedRef.current) {
        // Delayed initialization reduces race conditions
        const timer = setTimeout(() => {
          if (mountedRef.current) {
            setCanvasInitialized(true);
          }
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [webGLAvailable, contextLost, hasError]);

  // Handle canvas ready event
  const handleCanvasReady = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  };
  
  // Handle renderer ready event
  const handleRendererReady = () => {
    if (mountedRef.current) {
      setRendererReady(true);
    }
  };
  
  // Don't render canvas if WebGL is not available or there's an error
  if (!webGLAvailable || hasError || contextLost) {
    console.log("Not rendering Canvas because:", { webGLAvailable, hasError, contextLost });
    return null;
  }
  
  return (
    <CanvasContainer theme={theme} ref={containerRef}>
      <Canvas
        key={`canvas-${theme}-${Date.now()}`} // Ensure fresh canvas creation
        onCreated={() => {
          console.log("Canvas created successfully");
          setCanvasInitialized(true);
        }}
        camera={{ position: [0, 5, 15], fov: 50, near: 0.1, far: 1000 }}
        shadows={false} // Disable shadows for better performance
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        frameloop="demand" // Only render when needed for better performance
        gl={{ 
          antialias: true,
          alpha: true,
          depth: true, // Enable depth buffer
          stencil: false, // Disable stencil buffer (not needed)
          preserveDrawingBuffer: true,
          powerPreference: 'default', // Changed from high-performance for better compatibility
          failIfMajorPerformanceCaveat: false
        }}
      >
        {canvasInitialized && (
          <>
            <WebGLContextManager
              canvasRef={canvasRef}
              onContextLost={onWebGLContextLost}
              onContextRestored={onWebGLContextRestored}
            />
            
            <CanvasContent
              theme={theme}
              isLoading={isLoading}
              data={data}
              onCanvasReady={handleCanvasReady}
              onRendererReady={handleRendererReady}
            />
          </>
        )}
      </Canvas>
    </CanvasContainer>
  );
};
