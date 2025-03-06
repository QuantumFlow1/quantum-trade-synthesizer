
import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { ColorTheme } from "@/hooks/use-theme-detection";
import * as THREE from "three";
import { TradingDataPoint } from "@/utils/tradingData";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [frameRate, setFrameRate] = useState<'low' | 'normal'>('normal');
  
  // Determine if we should use low frame rate mode based on device
  useEffect(() => {
    // Check if this is likely a low-end device
    const isLowEndDevice = () => {
      // Check for mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Check for low memory (available in some browsers)
      const hasLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
      
      // Check for low number of logical processors
      const hasLowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
      
      return isMobile || hasLowMemory || hasLowCPU;
    };
    
    setFrameRate(isLowEndDevice() ? 'low' : 'normal');
  }, []);
  
  if (!webGLAvailable || hasError || contextLost || isLoading) {
    return null;
  }
  
  return (
    <div className="absolute inset-0">
      <Canvas
        ref={canvasRef}
        shadows={false}
        frameloop={frameRate === 'low' ? 'demand' : 'always'} // Use demand mode for low-end devices
        dpr={[0.5, 1.0]} // Reduced DPR even further for better performance
        camera={{ position: [0, 5, 15], fov: 45 }} // Reduced FOV even more
        style={{ background: theme === 'dark' ? 'linear-gradient(to bottom, #0f172a, #1e293b)' : 'linear-gradient(to bottom, #e0f2fe, #f0f9ff)' }}
        gl={{ 
          antialias: false, // Disable antialiasing completely
          alpha: false, // Disable alpha channel
          preserveDrawingBuffer: false,
          powerPreference: 'low-power',
          failIfMajorPerformanceCaveat: false,
          depth: true,
          stencil: false,
          logarithmicDepthBuffer: false
        }}
        performance={{ min: 0.5 }} // Allow dropping to 50% performance
        onCreated={({ gl, scene, camera }) => {
          rendererRef.current = gl;
          
          // Set minimal precision
          gl.getContext().getExtension('WEBGL_lose_context');
          
          // Set clear color
          gl.setClearColor(theme === 'dark' ? '#0f172a' : '#e0f2fe', 1);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          
          // Disable memory-intensive features
          gl.shadowMap.enabled = false;
          gl.shadowMap.autoUpdate = false;
          gl.shadowMap.needsUpdate = false;
          gl.info.autoReset = false;
          gl.info.reset();
          
          // Set low pixel ratio
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
          
          // Set simplified background
          scene.background = new THREE.Color(theme === 'dark' ? '#0f172a' : '#e0f2fe');
          scene.fog = null; // Remove fog if present
          
          // Optimize camera frustum
          camera.near = 1; // Increase near plane distance
          camera.far = 50; // Decrease far plane distance
          camera.updateProjectionMatrix();
          
          // Add WebGL context event listeners
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.error('WebGL context lost. Trying to restore...');
            onWebGLContextLost();
          });
          
          canvas.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored!');
            onWebGLContextRestored();
          });
          
          // Implement memory management
          const handleVisibilityChange = () => {
            if (document.hidden) {
              // Page is hidden, release GPU resources
              gl.renderLists.dispose();
              if (rendererRef.current) {
                rendererRef.current.dispose();
              }
            }
          };
          
          document.addEventListener('visibilitychange', handleVisibilityChange);
          
          return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
          };
        }}
      >
        <Scene data={data} optimizationLevel={frameRate === 'low' ? 'aggressive' : 'normal'} />
      </Canvas>
    </div>
  );
};
