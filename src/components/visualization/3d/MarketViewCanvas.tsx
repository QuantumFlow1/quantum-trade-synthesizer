
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
  const [rendererReady, setRendererReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    // Reset canvas initialization state when props change
    if (hasError || contextLost) {
      console.log("Resetting canvas initialization due to error or context loss");
      setCanvasInitialized(false);
      setRendererReady(false);
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
    
    // Configure renderer for better performance
    if (state && state.gl) {
      state.gl.setClearColor(theme === 'dark' ? '#0a0a14' : '#f0f4f8');
      state.gl.setPixelRatio(window.devicePixelRatio || 1);
      // Store reference to the actual canvas element
      if (state.gl.domElement) {
        canvasRef.current = state.gl.domElement;
      }
    }
    
    setCanvasInitialized(true);
    
    // Allow a brief moment for the renderer to initialize before rendering content
    setTimeout(() => {
      setRendererReady(true);
    }, 100);
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
        frameloop="always" // Always render to prevent black screen
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false, // Don't fail on performance issues
          // Ensure depth and stencil buffers are created
          depth: true,
          stencil: false
        }}
        style={{ background: theme === 'dark' ? darkBackground : lightBackground }}
      >
        <Suspense fallback={null}>
          <ThemeBasedLighting optimizationLevel={optimizationLevel} />
          <GroundPlane theme={theme} optimizationLevel={optimizationLevel} />
          {rendererReady && <Scene data={data} optimizationLevel={optimizationLevel} />}
        </Suspense>
      </Canvas>
    </div>
  );
};
