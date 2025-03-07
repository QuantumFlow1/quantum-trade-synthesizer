
import { useRef, useEffect, useState } from "react";
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
import { toast } from "@/hooks/use-toast";

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
  const theme = useThemeDetection();
  const [renderingStarted, setRenderingStarted] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // Used to force re-render
  const initialRenderAttemptedRef = useRef(false);
  const mountedRef = useRef(true);
  const autoRetryTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use the WebGL state hook to manage loading and error states
  const {
    isLoading,
    hasError,
    webGLAvailable,
    contextLost,
    loadingTime,
    handleContextLost,
    handleContextRestored,
    handleRetry,
    setIsLoading
  } = useWebGLState();
  
  // Check if data is ready for rendering
  useEffect(() => {
    if (visualizationData.length > 0) {
      console.log("Visualization data ready:", visualizationData.length, "points");
      if (mountedRef.current) {
        setDataReady(true);
      }
    } else {
      console.log("Waiting for visualization data...");
    }
  }, [visualizationData]);
  
  // Start rendering with a slight delay to avoid blocking main thread
  useEffect(() => {
    if (dataReady && !initialRenderAttemptedRef.current && mountedRef.current) {
      initialRenderAttemptedRef.current = true;
      
      // Start rendering immediately
      if (mountedRef.current) {
        console.log("Starting 3D rendering");
        setRenderingStarted(true);
      }
      
      // Set up auto-retry for initialization failures
      if (autoRetryTimerRef.current) {
        clearTimeout(autoRetryTimerRef.current);
      }
      
      autoRetryTimerRef.current = setTimeout(() => {
        if (mountedRef.current && isLoading) {
          console.log("Auto-retrying 3D initialization due to timeout");
          setRenderKey(prev => prev + 1); // Force canvas recreation
          setIsLoading(false); // Reset loading state
        }
      }, 5000);
    }
    
    return () => {
      if (autoRetryTimerRef.current) {
        clearTimeout(autoRetryTimerRef.current);
      }
    };
  }, [dataReady, isLoading, setIsLoading]);
  
  // Notify parent components of errors
  useEffect(() => {
    if (hasError || contextLost || !webGLAvailable) {
      console.log("3D View error state detected:", { hasError, contextLost, webGLAvailable });
      onError?.();
    }
  }, [hasError, contextLost, webGLAvailable, onError]);
  
  // Notify parent when loading is done
  useEffect(() => {
    if (!isLoading && !hasError && webGLAvailable && !contextLost && renderingStarted) {
      console.log("3D View loaded successfully");
      onLoaded?.();
    }
  }, [isLoading, hasError, webGLAvailable, contextLost, renderingStarted, onLoaded]);
  
  // Component unmount cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (autoRetryTimerRef.current) {
        clearTimeout(autoRetryTimerRef.current);
      }
    };
  }, []);
  
  // Handle WebGL context restoration
  const handleWebGLRestore = () => {
    console.log("Attempting to restore WebGL context");
    handleContextRestored();
    
    // Reset rendering state to force fresh start
    if (mountedRef.current) {
      setRenderingStarted(false);
      initialRenderAttemptedRef.current = false;
      setRenderKey(prev => prev + 1); // Force canvas recreation
    
      // Restart rendering after a brief delay
      setTimeout(() => {
        if (mountedRef.current) {
          setRenderingStarted(true);
        }
      }, 100);
    
      toast({
        title: "3D View Restarted",
        description: "Visualization has been refreshed.",
      });
    }
  };
  
  // Force reinitialize the canvas
  const handleForceRestart = () => {
    console.log("Force restarting 3D view");
    setRenderKey(prev => prev + 1);
    setRenderingStarted(false);
    initialRenderAttemptedRef.current = false;
    
    // Small delay to ensure DOM updates
    setTimeout(() => {
      if (mountedRef.current) {
        setRenderingStarted(true);
      }
    }, 100);
  };
  
  // Determine which error state to show
  const getErrorStateType = () => {
    if (contextLost) return 'context-lost';
    if (!webGLAvailable) return 'unsupported';
    return 'error';
  };
  
  // Don't render anything until we're ready to start rendering
  if (!renderingStarted) {
    return (
      <Card className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] transition-all h-[500px] overflow-hidden">
        <MarketViewHeader isSimulationMode={isSimulationMode} />
        <LoadingState 
          message="Initializing 3D Visualization..." 
          retryAction={handleForceRestart}
          loadingTime={5000} // Show retry after 5 seconds
        />
      </Card>
    );
  }
  
  return (
    <Card className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all h-[500px] overflow-hidden">
      {/* Header */}
      <MarketViewHeader isSimulationMode={isSimulationMode} />
      
      {/* Stats overlay */}
      {!isLoading && !hasError && !contextLost && (
        <StatsOverlay 
          avgPrice={stats.avgPrice} 
          priceChange={stats.priceChange} 
          priceChangePercent={stats.priceChangePercent}
          theme={theme}
        />
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <LoadingState 
          message={
            dataReady 
              ? "Preparing 3D environment..." 
              : "Loading market data..."
          }
          retryAction={handleForceRestart}
          loadingTime={loadingTime}
        />
      )}
      
      {/* Error state */}
      {(hasError || contextLost || (!webGLAvailable && !isLoading)) && (
        <WebGLErrorState 
          type={getErrorStateType()} 
          onRetry={hasError ? handleRetry : handleWebGLRestore} 
        />
      )}
      
      {/* Controls - only show when not loading or error */}
      {!isLoading && !hasError && !contextLost && webGLAvailable && (
        <div className="absolute bottom-4 left-6 z-10">
          <VisualizationControls />
        </div>
      )}
      
      {/* 3D Canvas */}
      {renderingStarted && !hasError && !contextLost && webGLAvailable && (
        <MarketViewCanvas 
          key={`canvas-${renderKey}`} // Force re-create canvas on key change
          theme={theme}
          webGLAvailable={webGLAvailable}
          hasError={hasError}
          contextLost={contextLost}
          isLoading={isLoading}
          data={visualizationData}
          onWebGLContextLost={handleContextLost}
          onWebGLContextRestored={handleWebGLRestore}
        />
      )}
    </Card>
  );
};
