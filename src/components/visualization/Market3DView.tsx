
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
  const [restoreAttempts, setRestoreAttempts] = useState(0);
  const theme = useThemeDetection();
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // More reliable WebGL availability check
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      
      // First try to get a WebGL2 context which is more stable
      let gl = canvas.getContext('webgl2');
      
      // Fall back to WebGL1 if WebGL2 is not available
      if (!gl) {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      }
      
      if (gl) {
        // Check for required extensions
        const extensions = [
          'OES_texture_float',
          'OES_texture_float_linear',
          'OES_standard_derivatives'
        ];
        
        const missingExtensions = extensions.filter(ext => !gl!.getExtension(ext));
        
        if (missingExtensions.length > 0) {
          console.warn("Some WebGL extensions are missing:", missingExtensions);
        }
        
        setWebGLAvailable(true);
        setHasError(false);
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
  
  // Longer loading state to ensure resources are properly initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Increased from 1500ms to 2000ms
    
    return () => clearTimeout(timer);
  }, []);
  
  // Enhanced WebGL error handling with progressive backoff for context restoration
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.error("WebGL context loss detected", event);
      setContextLost(true);
      setHasError(true);
      
      // Increment restore attempts
      setRestoreAttempts(prev => prev + 1);
      
      // Progressive backoff for restoration attempts (helps prevent rapid loops of context loss)
      const backoffTime = Math.min(1000 * Math.pow(1.5, restoreAttempts), 8000);
      
      // Try to restore after backoff
      setTimeout(() => {
        if (restoreAttempts < 3) {
          handleRetry();
        } else {
          console.error("Maximum WebGL restore attempts reached");
        }
      }, backoffTime);
    };
    
    const handleContextRestored = (event: Event) => {
      console.log("WebGL context restored", event);
      setContextLost(false);
      // Wait a moment before clearing the error state
      setTimeout(() => setHasError(false), 800);
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
  }, [restoreAttempts]);
  
  // Stats for display
  const priceChangeColor = stats.priceChange >= 0 
    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
    : theme === 'dark' ? 'text-red-400' : 'text-red-600';
    
  const priceChangeSymbol = stats.priceChange >= 0 ? '▲' : '▼';
  
  // Function to reset visualization state and retry rendering
  const handleRetry = () => {
    setContextLost(false);
    setHasError(false);
    setIsLoading(true);
    
    // Force WebGL context check again
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || 
                 canvas.getContext('webgl') || 
                 canvas.getContext('experimental-webgl');
      setWebGLAvailable(!!gl);
    } catch (e) {
      console.error("WebGL retry check failed:", e);
      setWebGLAvailable(false);
    }
    
    setTimeout(() => setIsLoading(false), 2000);
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
            <p className="text-lg font-medium">Initializing 3D visualization...</p>
            <p className="text-sm text-muted-foreground">This may take a moment...</p>
          </div>
        </div>
      )}
      
      {/* Error state with more detailed guidance */}
      {(hasError || contextLost) && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center space-y-4 text-destructive max-w-md text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg font-medium">
              {contextLost ? "WebGL context lost" : "Unable to load 3D visualization"}
            </p>
            <p className="text-sm">
              {contextLost 
                ? "The 3D rendering was interrupted. This is often due to GPU memory pressure or driver limitations."
                : "Your browser may not support WebGL, or there might be an issue with your graphics hardware."
              }
            </p>
            <div className="text-sm mt-2 text-muted-foreground">
              <p>Try these solutions:</p>
              <ul className="list-disc text-left ml-6 mt-2">
                <li>Close other browser tabs and applications</li>
                <li>Update your graphics drivers</li>
                <li>Disable hardware acceleration in your browser settings</li>
                <li>Try a different browser (Chrome or Firefox recommended)</li>
              </ul>
            </div>
            <button 
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-md transition-colors"
            >
              Retry with Simplified Settings
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
      
      {/* 3D Canvas with simplified and improved rendering settings */}
      <div className="absolute inset-0">
        {webGLAvailable && !hasError && !contextLost && !isLoading && (
          <Canvas
            ref={canvasRef}
            shadows={false} // Disable shadows for better performance
            dpr={[1, 1.5]} // Limit pixel ratio to improve performance
            camera={{ position: [0, 5, 15], fov: 50 }} // Reduced FOV from 60 to 50
            style={{ background: theme === 'dark' ? 'linear-gradient(to bottom, #0f172a, #1e293b)' : 'linear-gradient(to bottom, #e0f2fe, #f0f9ff)' }}
            gl={{ 
              antialias: true,
              alpha: true,
              preserveDrawingBuffer: false, // Changed to false for better performance
              powerPreference: 'low-power', // Changed to low-power for better stability
              failIfMajorPerformanceCaveat: false,
              depth: true,
              stencil: false,
              logarithmicDepthBuffer: false
            }}
            onCreated={({ gl, scene }) => {
              rendererRef.current = gl;
              gl.setClearColor(theme === 'dark' ? '#0f172a' : '#e0f2fe', 1);
              gl.outputColorSpace = THREE.SRGBColorSpace;
              
              // Disable some features for better performance
              gl.shadowMap.enabled = false;
              gl.info.autoReset = false; // Don't auto-reset memory info
              
              // Apply memory-saving renderer settings
              const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
              
              // Set up scene with very simple background
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
                  // Re-initialize after context restoration
                  if (gl) {
                    gl.setClearColor(theme === 'dark' ? '#0f172a' : '#e0f2fe', 1);
                    gl.outputColorSpace = THREE.SRGBColorSpace;
                    gl.shadowMap.enabled = false;
                  }
                }, 500);
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
