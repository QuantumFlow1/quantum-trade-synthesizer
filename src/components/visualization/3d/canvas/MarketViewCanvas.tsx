
import { Canvas } from "@react-three/fiber";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";
import { useEffect, useState, useRef, useCallback } from "react";
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
  
  // Reset states when key props change
  useEffect(() => {
    if (hasError || contextLost) {
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
        // Immediate initialization for faster display
        setCanvasInitialized(true);
      }
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [webGLAvailable, contextLost, hasError]);

  // Handle canvas ready event
  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);
  
  // Handle renderer ready event
  const handleRendererReady = useCallback(() => {
    if (mountedRef.current) {
      setRendererReady(true);
    }
  }, []);
  
  // Don't render canvas if WebGL is not available or there's an error
  if (!webGLAvailable || hasError || contextLost) {
    return null;
  }
  
  return (
    <CanvasContainer theme={theme} ref={containerRef}>
      <Canvas
        camera={{ position: [0, 5, 15], fov: 50, near: 0.1, far: 1000 }}
        shadows={false} // Disable shadows for better performance
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        gl={{ 
          antialias: true,
          alpha: true,
          depth: true,
          stencil: false,
          preserveDrawingBuffer: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false
        }}
        onCreated={() => {
          setCanvasInitialized(true);
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
