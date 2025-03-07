
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";
import { Suspense, useEffect, useState, useRef } from "react";
import { ThemeBasedLighting } from "./ThemeBasedLighting";
import { GroundPlane } from "./GroundPlane";
import { OrbitControls } from "@react-three/drei";

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
  const canvasContainerRef = useRef<HTMLDivElement>(null);
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
  
  // Force a remount of the Canvas when webGLAvailable changes
  useEffect(() => {
    if (webGLAvailable) {
      if (mountedRef.current) {
        setCanvasInitialized(false);
      }
      
      // Reduced delay for faster initialization
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          setCanvasInitialized(true);
        }
      }, 100); // Reduced from 300ms to 100ms
      
      return () => clearTimeout(timer);
    }
  }, [webGLAvailable]);
  
  // Don't render canvas if WebGL is not available or there's an error
  if (!webGLAvailable || hasError || contextLost) {
    console.log("Not rendering Canvas because:", { webGLAvailable, hasError, contextLost });
    return null;
  }
  
  const handleContextLost = (event: Event) => {
    console.error("WebGL context lost event triggered");
    event.preventDefault(); // Standard practice to allow recovery
    onWebGLContextLost();
  };
  
  const handleContextRestored = () => {
    console.log("WebGL context restored event triggered");
    onWebGLContextRestored();
  };
  
  const handleCreated = (state: any) => {
    console.log("3D Canvas initialized successfully");
    
    // Configure renderer for better performance and stability
    if (state && state.gl) {
      try {
        // Set clear color based on theme
        state.gl.setClearColor(theme === 'dark' ? '#0a0a14' : '#f0f4f8', 1);
        
        // Set pixel ratio (limiting to 1.5 for performance)
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        state.gl.setPixelRatio(pixelRatio);
        
        // Store reference to the canvas
        if (state.gl.domElement) {
          canvasRef.current = state.gl.domElement;
        }
        
        // Configure additional WebGL parameters for stability
        if (state.gl.getContext) {
          // Only try to enable features if webgl context is accessible via getContext
          state.gl.enable(state.gl.DEPTH_TEST);
          state.gl.depthFunc(state.gl.LEQUAL);
          state.gl.enable(state.gl.BLEND);
          state.gl.blendFunc(state.gl.SRC_ALPHA, state.gl.ONE_MINUS_SRC_ALPHA);
        }
      } catch (e) {
        console.error("Error configuring WebGL context:", e);
        // Don't let this crash the component - we'll handle gracefully
      }
    }
    
    if (mountedRef.current) {
      setCanvasInitialized(true);
      
      // Reduced delay for faster rendering of content
      setTimeout(() => {
        if (mountedRef.current) {
          setRendererReady(true);
        }
      }, 50); // Reduced from 200ms to 50ms
    }
  };
  
  // Determine optimization level based on loading state
  const optimizationLevel = isLoading ? 'aggressive' : 'normal';
  
  // Background gradients based on theme
  const darkBackground = 'radial-gradient(circle, #1a1a3a 0%, #0f0f23 100%)';
  const lightBackground = 'radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%)';
  
  return (
    <div 
      ref={canvasContainerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ background: theme === 'dark' ? darkBackground : lightBackground }}
    >
      <Canvas
        key={`canvas-${canvasInitialized}-${theme}`} // Add key to force proper re-renders
        onCreated={(state) => {
          // Register WebGL context event listeners
          try {
            if (state && state.gl && state.gl.domElement) {
              const canvas = state.gl.domElement;
              canvas.addEventListener('webglcontextlost', handleContextLost, false);
              canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
            }
            handleCreated(state);
          } catch (err) {
            console.error("Error during canvas creation:", err);
          }
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
        <Suspense fallback={null}>
          <ThemeBasedLighting optimizationLevel={optimizationLevel} />
          <GroundPlane theme={theme} optimizationLevel={optimizationLevel} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={true} 
            rotateSpeed={0.5}
            zoomSpeed={0.7}
            minDistance={5}
            maxDistance={30}
          />
          {rendererReady && data.length > 0 && (
            <Scene data={data} optimizationLevel={optimizationLevel} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
