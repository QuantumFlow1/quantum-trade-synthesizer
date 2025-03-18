
import { Canvas } from "@react-three/fiber";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";
import { useEffect, useState, useRef, useMemo } from "react";
import { CanvasContainer } from "./canvas/CanvasContainer";
import { WebGLContextManager } from "./canvas/WebGLContextManager";
import { CanvasContent } from "./canvas/CanvasContent";

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
  const frameIdRef = useRef<number | null>(null);
  
  // Optimize data processing with useMemo to avoid redundant calculations
  const processedData = useMemo(() => {
    // Limit the number of data points to improve performance
    const maxDataPoints = 500;
    if (data.length > maxDataPoints) {
      // Sample data to reduce the number of points
      const samplingRate = Math.ceil(data.length / maxDataPoints);
      return data.filter((_, index) => index % samplingRate === 0);
    }
    return data;
  }, [data]);
  
  // Debug log to track component lifecycle
  useEffect(() => {
    console.log("MarketViewCanvas mounted with props:", { 
      webGLAvailable, hasError, contextLost, isLoading, dataLength: data.length 
    });
    
    return () => {
      console.log("MarketViewCanvas unmounting");
      mountedRef.current = false;
      
      // Cancel any pending animation frames
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
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
  
  // Create a new canvas when needed using a debounced approach
  useEffect(() => {
    if (webGLAvailable && !contextLost && !hasError) {
      if (mountedRef.current) {
        // Debounce initialization to reduce thrashing during rapid prop changes
        let initTimer: NodeJS.Timeout;
        
        const initCanvas = () => {
          if (mountedRef.current) {
            setCanvasInitialized(true);
          }
        };
        
        // Use setTimeout for initialization to reduce load during page setup
        initTimer = setTimeout(initCanvas, 300);
        
        return () => clearTimeout(initTimer);
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
        key={`canvas-${theme}`} // Only re-create on theme change
        onCreated={() => {
          console.log("Canvas created successfully");
          setCanvasInitialized(true);
        }}
        camera={{ position: [0, 5, 15], fov: 50, near: 0.1, far: 1000 }}
        shadows={false} // Disable shadows for better performance
        dpr={1} // Lower DPR for better performance
        frameloop="demand" // Only render when needed for better performance
        gl={{ 
          antialias: false, // Disable antialiasing for performance
          alpha: true,
          depth: true, // Enable depth buffer
          stencil: false, // Disable stencil buffer (not needed)
          preserveDrawingBuffer: true,
          powerPreference: 'default', // Changed from high-performance for better compatibility
          failIfMajorPerformanceCaveat: false
        }}
        performance={{ min: 0.5 }} // Allow ThreeJS to reduce quality for performance
      >
        {canvasInitialized && (
          <>
            <WebGLContextManager
              canvasRef={canvasRef}
              onContextLost={onWebGLContextLost}
              onContextRestored={onWebGLContextRestored}
              videoTextureEnabled={false} // Disable video textures for performance
            />
            
            <CanvasContent
              theme={theme}
              isLoading={isLoading}
              data={processedData} // Use optimized data
              onCanvasReady={handleCanvasReady}
              onRendererReady={handleRendererReady}
            />
          </>
        )}
      </Canvas>
    </CanvasContainer>
  );
};
