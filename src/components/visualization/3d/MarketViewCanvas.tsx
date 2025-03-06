
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";
import { Suspense, useEffect, useState } from "react";
import { ThemeBasedLighting } from "./ThemeBasedLighting";
import { GroundPlane } from "./GroundPlane";

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
  
  useEffect(() => {
    // Reset canvas initialization state when props change
    if (hasError || contextLost) {
      setCanvasInitialized(false);
    }
  }, [hasError, contextLost]);
  
  // Don't render canvas if WebGL is not available or there's an error
  if (!webGLAvailable || hasError || contextLost) {
    return null;
  }
  
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    console.error("WebGL context lost event detected");
    onWebGLContextLost();
  };
  
  const handleContextRestored = () => {
    console.log("WebGL context restored event detected");
    onWebGLContextRestored();
  };
  
  const handleCreated = () => {
    console.log("3D Canvas initialized successfully");
    setCanvasInitialized(true);
  };
  
  const optimizationLevel = isLoading ? 'aggressive' : 'normal';
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Canvas
        onCreated={(state) => {
          // Add event listeners for context lost/restored events
          const canvas = state.gl.domElement;
          canvas.addEventListener('webglcontextlost', handleContextLost);
          canvas.addEventListener('webglcontextrestored', handleContextRestored);
          handleCreated();
        }}
        camera={{ position: [0, 5, 15], fov: 50 }}
        shadows={false} // Disable shadows for better performance
        dpr={[1, 1.5]} // Lower pixel ratio for better performance
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false // Don't fail on performance issues
        }}
        style={{ background: theme === 'dark' ? 'radial-gradient(circle, #1a1a3a 0%, #0f0f23 100%)' : 'radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%)' }}
      >
        <Suspense fallback={null}>
          <ThemeBasedLighting optimizationLevel={optimizationLevel} />
          <GroundPlane theme={theme} optimizationLevel={optimizationLevel} />
          <Scene data={data} optimizationLevel={optimizationLevel} />
        </Suspense>
      </Canvas>
    </div>
  );
};
