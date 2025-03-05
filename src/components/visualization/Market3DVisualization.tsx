
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
  const [renderError, setRenderError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Force canvas remount when toggling fullscreen
    setKey(prev => prev + 1);
  };
  
  // Force remount of Canvas when visibility changes or component mounts
  useEffect(() => {
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setKey(prev => prev + 1);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Error boundary for Canvas rendering
  const handleCanvasError = (error: Error) => {
    console.error("3D Visualization error:", error);
    setRenderError(`Error loading 3D visualization: ${error.message}`);
  };
  
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
      
      {renderError ? (
        <div className="flex items-center justify-center h-full w-full text-red-400 p-8 text-center">
          <div>
            <p className="mb-2">{renderError}</p>
            <button 
              onClick={() => {setKey(prev => prev + 1); setRenderError(null);}}
              className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-md text-white"
            >
              Retry Loading
            </button>
          </div>
        </div>
      ) : (
        <ErrorBoundary onError={handleCanvasError}>
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
        </ErrorBoundary>
      )}
      
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
        <span>Drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  );
};

// Simple ErrorBoundary component for Canvas
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  onError: (error: Error) => void;
}> {
  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    return this.props.children;
  }
}

import React from 'react';
