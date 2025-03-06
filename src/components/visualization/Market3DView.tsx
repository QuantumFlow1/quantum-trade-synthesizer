
import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./3d/Scene";
import { TradingDataPoint } from "@/utils/tradingData";
import { useMarket3DData } from "@/hooks/use-market-3d-data";
import { VisualizationControls } from "./3d/VisualizationControls";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { Sparkles, BarChart2, Activity } from "lucide-react";
import * as THREE from "three";

interface Market3DViewProps {
  data: TradingDataPoint[];
  isSimulationMode?: boolean;
}

export const Market3DView = ({ data, isSimulationMode = false }: Market3DViewProps) => {
  const { visualizationData, stats } = useMarket3DData(data);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const theme = useThemeDetection();
  
  // Improved WebGL availability check
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl) {
        // Try to create a minimal Three.js scene to verify WebGL works
        try {
          const renderer = new THREE.WebGLRenderer({ canvas });
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
          
          renderer.render(scene, camera);
          renderer.dispose();
          
          setWebGLAvailable(true);
          setHasError(false);
        } catch (rendererError) {
          console.error("WebGL renderer creation failed:", rendererError);
          setWebGLAvailable(false);
          setHasError(true);
        }
      } else {
        console.error("WebGL is not available in this browser");
        setWebGLAvailable(false);
        setHasError(true);
      }
    } catch (e) {
      console.error("Error checking WebGL support:", e);
      setWebGLAvailable(false);
      setHasError(true);
    }
  }, []);
  
  // Simulate loading state with a slightly longer delay to let resources initialize
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Enhanced WebGL error handling
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.error("WebGL context loss detected", event);
      setContextLost(true);
      setHasError(true);
    };
    
    const handleContextRestored = (event: Event) => {
      console.log("WebGL context restored", event);
      setContextLost(false);
      // Wait a moment before clearing the error state
      setTimeout(() => setHasError(false), 500);
    };
    
    const handleContextCreationError = (event: Event) => {
      console.error("WebGL context creation error detected", event);
      setHasError(true);
    };
    
    window.addEventListener("webglcontextlost", handleContextLost);
    window.addEventListener("webglcontextrestored", handleContextRestored);
    window.addEventListener("webglcontextcreationerror", handleContextCreationError);
    
    return () => {
      window.removeEventListener("webglcontextlost", handleContextLost);
      window.removeEventListener("webglcontextrestored", handleContextRestored);
      window.removeEventListener("webglcontextcreationerror", handleContextCreationError);
    };
  }, []);
  
  // Stats for display
  const priceChangeColor = stats.priceChange >= 0 
    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
    : theme === 'dark' ? 'text-red-400' : 'text-red-600';
    
  const priceChangeSymbol = stats.priceChange >= 0 ? '▲' : '▼';
  
  // Retry rendering
  const handleRetry = () => {
    setContextLost(false);
    setHasError(false);
    setIsLoading(true);
    
    // Force WebGL context check again
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLAvailable(!!gl);
    } catch (e) {
      console.error("WebGL retry check failed:", e);
      setWebGLAvailable(false);
    }
    
    setTimeout(() => setIsLoading(false), 1500);
  };
  
  return (
    <Card className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all h-[500px] overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-6 z-10 flex items-center space-x-2">
        <h2 className="text-xl font-bold flex items-center">
          <BarChart2 className="w-5 h-5 mr-2" /> 
          3D Market Visualization
        </h2>
        {isSimulationMode && (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-600/30">
            Simulation
          </Badge>
        )}
      </div>
      
      {/* Stats overlay */}
      <div className="absolute top-4 right-6 z-10 flex flex-col space-y-2">
        <Badge className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" /> 
          <span>Avg: ${stats.avgPrice.toFixed(2)}</span>
        </Badge>
        <Badge className={`bg-black/20 ${priceChangeColor} border-white/10 flex items-center gap-1.5`}>
          <Sparkles className="w-3.5 h-3.5" /> 
          <span>
            {priceChangeSymbol} ${Math.abs(stats.priceChange).toFixed(2)} 
            ({stats.priceChangePercent >= 0 ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%)
          </span>
        </Badge>
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-lg font-medium">Loading 3D visualization...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {(hasError || contextLost) && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center space-y-4 text-destructive max-w-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-medium">
              {contextLost ? "WebGL context lost" : "Unable to load 3D visualization"}
            </p>
            <p className="text-sm">
              {contextLost 
                ? "The 3D rendering context was lost. This may be due to GPU memory pressure or driver issues."
                : "Your browser may not support WebGL, or there might be an issue with your graphics drivers."
              }
            </p>
            <button 
              onClick={handleRetry}
              className="mt-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* No WebGL Support */}
      {!webGLAvailable && !isLoading && !hasError && !contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center space-y-4 max-w-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-medium">WebGL Not Supported</p>
            <p className="text-sm">Your browser or device doesn't support WebGL, which is required for 3D visualizations.</p>
            <p className="text-sm mt-2">Try using a different browser or updating your graphics drivers.</p>
            <button 
              onClick={handleRetry}
              className="mt-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-md transition-colors"
            >
              Try Anyway
            </button>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="absolute bottom-4 left-6 z-10">
        <VisualizationControls />
      </div>
      
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        {webGLAvailable && !hasError && !contextLost && !isLoading && (
          <Canvas
            ref={canvasRef}
            shadows
            camera={{ position: [0, 5, 15], fov: 60 }}
            style={{ background: theme === 'dark' ? 'linear-gradient(to bottom, #0f172a, #1e293b)' : 'linear-gradient(to bottom, #e0f2fe, #f0f9ff)' }}
            gl={{ 
              antialias: true,
              alpha: true,
              preserveDrawingBuffer: true,
              powerPreference: 'default', // Changed from high-performance to default for better stability
              failIfMajorPerformanceCaveat: false,
              depth: true,
              stencil: false,
              logarithmicDepthBuffer: false // Disable logarithmic depth buffer which can cause issues
            }}
            onCreated={({ gl, scene }) => {
              gl.setClearColor(theme === 'dark' ? '#0f172a' : '#e0f2fe', 1);
              gl.outputColorSpace = THREE.SRGBColorSpace;
              
              // Lower precision if needed for better performance
              gl.getContext().getExtension('OES_standard_derivatives');
              
              // Set up scene with simplified background
              scene.background = new THREE.Color(theme === 'dark' ? '#0f172a' : '#e0f2fe');
              
              // Add custom error listener for canvas
              const canvas = gl.domElement;
              canvas.addEventListener('webglcontextlost', (event) => {
                event.preventDefault();
                console.error('WebGL context lost. Trying to restore...');
                setContextLost(true);
              });
              
              canvas.addEventListener('webglcontextrestored', () => {
                console.log('WebGL context restored!');
                setContextLost(false);
                setTimeout(() => {
                  gl.setClearColor(theme === 'dark' ? '#0f172a' : '#e0f2fe', 1);
                  gl.outputColorSpace = THREE.SRGBColorSpace;
                }, 100);
              });
            }}
          >
            <Scene data={visualizationData} />
          </Canvas>
        )}
      </div>
    </Card>
  );
};
