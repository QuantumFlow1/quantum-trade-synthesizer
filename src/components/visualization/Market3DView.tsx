
import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { TradingDataPoint } from "@/utils/tradingData";
import { useMarket3DData } from "@/hooks/use-market-3d-data";
import { VisualizationControls } from "./3d/VisualizationControls";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { useWebGLState } from "@/hooks/use-webgl-state";
import { WebGLErrorState } from "./3d/errors/WebGLErrorState";
import { LoadingState } from "./3d/LoadingState";
import { StatsOverlay } from "./3d/StatsOverlay";
import { MarketViewHeader } from "./3d/MarketViewHeader";
import { MarketViewCanvas } from "./3d/MarketViewCanvas";

interface Market3DViewProps {
  data: TradingDataPoint[];
  isSimulationMode?: boolean;
  onError?: () => void;
  onLoaded?: () => void;
}

export const Market3DView = ({ 
  data, 
  isSimulationMode = false,
  onError,
  onLoaded
}: Market3DViewProps) => {
  const { visualizationData, stats } = useMarket3DData(data);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeDetection();
  
  // Use the WebGL state hook to manage loading and error states
  const {
    isLoading,
    hasError,
    webGLAvailable,
    contextLost,
    handleContextLost,
    handleContextRestored,
    handleRetry
  } = useWebGLState();
  
  // Notify parent components of errors
  useEffect(() => {
    if (hasError || contextLost || !webGLAvailable) {
      onError?.();
    }
  }, [hasError, contextLost, webGLAvailable, onError]);
  
  // Notify parent when loading is done
  useEffect(() => {
    if (!isLoading && !hasError && webGLAvailable && !contextLost) {
      onLoaded?.();
    }
  }, [isLoading, hasError, webGLAvailable, contextLost, onLoaded]);
  
  // Determine which error state to show
  const getErrorStateType = () => {
    if (contextLost) return 'context-lost';
    if (!webGLAvailable) return 'unsupported';
    return 'error';
  };
  
  return (
    <Card className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all h-[500px] overflow-hidden">
      {/* Header */}
      <MarketViewHeader isSimulationMode={isSimulationMode} />
      
      {/* Stats overlay */}
      <StatsOverlay 
        avgPrice={stats.avgPrice} 
        priceChange={stats.priceChange} 
        priceChangePercent={stats.priceChangePercent}
        theme={theme}
      />
      
      {/* Loading overlay */}
      {isLoading && <LoadingState />}
      
      {/* Error state */}
      {(hasError || contextLost || (!webGLAvailable && !isLoading)) && (
        <WebGLErrorState 
          type={getErrorStateType()} 
          onRetry={handleRetry} 
        />
      )}
      
      {/* Controls */}
      <div className="absolute bottom-4 left-6 z-10">
        <VisualizationControls />
      </div>
      
      {/* 3D Canvas */}
      <MarketViewCanvas 
        theme={theme}
        webGLAvailable={webGLAvailable}
        hasError={hasError}
        contextLost={contextLost}
        isLoading={isLoading}
        data={visualizationData}
        onWebGLContextLost={handleContextLost}
        onWebGLContextRestored={handleContextRestored}
      />
    </Card>
  );
};
