
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";
import { Suspense, useEffect, useState, useRef } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    // Reset canvas initialization state when props change
    if (hasError || contextLost) {
      console.log("Resetting canvas initialization due to error or context loss");
      setCanvasInitialized(false);
    }
  }, [hasError, contextLost]);
  
  // Cleanup function to properly dispose WebGL context on unmount
  useEffect(() => {
    return () => {
      console.log("MarketViewCanvas unmounting, cleaning up resources");
      // By this point, we don't need to do anything special
      // Three.js/React Three Fiber handles WebGL context disposal
    };
  }, []);
  
  // Don't render canvas if WebGL is not available or there's an error
  if (!webGLAvailable || hasError || contextLost) {
    console.log("Not rendering Canvas because:", { webGLAvailable, hasError, contextLost });
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
  
  const handleCreated = (state: any) => {
    console.log("3D Canvas initialized successfully");
    
    // Store reference to the actual canvas element
    if (state && state.gl && state.gl.domElement) {
      canvasRef.current = state.gl.domElement;
    }
    
    setCanvasInitialized(true);
  };
  
  // Determine optimization level for the scene based on loading state
  const optimizationLevel = isLoading ? 'aggressive' : 'normal';
  
  // Choose a lighter background in dark mode to improve contrast
  const darkBackground = 'radial-gradient(circle, #1a1a3a 0%, #0f0f23 100%)';
  const lightBackground = 'radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%)';
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Canvas
        onCreated={(state) => {
          // Add event listeners for context lost/restored events
          const canvas = state.gl.domElement;
          canvas.addEventListener('webglcontextlost', handleContextLost);
          canvas.addEventListener('webglcontextrestored', handleContextRestored);
          handleCreated(state);
        }}
        camera={{ position: [0, 5, 15], fov: 50 }}
        shadows={false} // Disable shadows for better performance
        dpr={[1, 1.5]} // Lower pixel ratio for better performance
        frameloop={isLoading ? 'demand' : 'always'} // Only render when needed during loading
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false // Don't fail on performance issues
        }}
        style={{ background: theme === 'dark' ? darkBackground : lightBackground }}
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
