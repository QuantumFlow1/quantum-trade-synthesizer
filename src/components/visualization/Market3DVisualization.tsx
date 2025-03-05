
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { TradingDataPoint } from "@/utils/tradingData";
import { Scene } from "./3d/Scene";
import { VisualizationControls } from "./3d/VisualizationControls";

interface Market3DVisualizationProps {
  data: TradingDataPoint[];
  isSimulationMode?: boolean;
}

export const Market3DVisualization = ({ 
  data, 
  isSimulationMode = false 
}: Market3DVisualizationProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0); // Key for forcing canvas remount
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Force canvas remount when toggling fullscreen
    setKey(prev => prev + 1);
  };
  
  // Force remount of Canvas when visibility changes
  useEffect(() => {
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setKey(prev => prev + 1);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`bg-black/90 rounded-lg overflow-hidden border border-gray-800 ${
        isFullscreen ? "fixed inset-0 z-50" : "h-[500px]"
      }`}
    >
      <VisualizationControls 
        isFullscreen={isFullscreen} 
        toggleFullscreen={toggleFullscreen}
        isSimulationMode={isSimulationMode}
      />
      
      <Canvas 
        key={key} 
        shadows 
        camera={{ position: [0, 5, 14], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true 
        }}
      >
        <Scene data={data} />
      </Canvas>
      
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
        <span>Drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  );
};
