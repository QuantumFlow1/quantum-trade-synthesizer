
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
  
  if (!webGLAvailable || hasError || contextLost || isLoading) {
    return null;
  }
  
  return (
    <div className="absolute inset-0">
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
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          
          // Set up scene with very simple background
          scene.background = new THREE.Color(theme === 'dark' ? '#0f172a' : '#e0f2fe');
          
          // Add custom error listener for canvas
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
        }}
      >
        <Scene data={data} />
      </Canvas>
    </div>
  );
};
