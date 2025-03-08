
import { useRef, useState, useEffect } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { useMarket3DData } from "@/hooks/use-market-3d-data";
import { Market3DInitializing } from "./3d/Market3DInitializing";
import { Market3DVisualization } from "./3d/Market3DVisualization";
import { useImprovedMarket3DView, useThemeDetection, useWebGLState } from "@/hooks/use-theme-detection";

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
  console.log("Market3DView rendered with data length:", data.length);
  
  const {
    visualizationData,
    stats,
    isProcessing
  } = useMarket3DData(data);
  
  const [renderingStarted, setRenderingStarted] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const initialRenderAttemptedRef = useRef(false);
  const mountedRef = useRef(true);
  
  // Import these from our improved hooks
  const {
    theme,
    isLoading,
    hasError,
    webGLAvailable,
    contextLost,
    loadingTime,
    handleContextLost,
    handleContextRestored,
    handleRetry,
    handleWebGLRestore,
    getErrorStateType
  } = useImprovedMarket3DView({ 
    visualizationData, 
    onError, 
    onLoaded 
  });

  // Log visualization data to help with debugging
  useEffect(() => {
    console.log("Visualization data updated:", visualizationData.length);
    console.log("Stats:", stats);
    console.log("WebGL available:", webGLAvailable);
    console.log("Has error:", hasError);
    console.log("Context lost:", contextLost);
  }, [visualizationData, stats, webGLAvailable, hasError, contextLost]);

  // Start rendering with a slight delay to avoid blocking main thread
  useEffect(() => {
    if (visualizationData.length > 0 && !initialRenderAttemptedRef.current && mountedRef.current) {
      initialRenderAttemptedRef.current = true;
      console.log("Starting 3D rendering");
      
      // Set rendering started immediately to avoid flickering
      setRenderingStarted(true);
      
      // Force a re-render with a new key after a small delay
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          console.log("Updating render key");
          setRenderKey(prev => prev + 1);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [visualizationData]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Don't render anything until we have data
  if (!renderingStarted || isProcessing) {
    console.log("Showing initializing state");
    return (
      <Market3DInitializing
        isSimulationMode={isSimulationMode}
        onRetry={() => {
          console.log("Retrying 3D initialization");
          setRenderKey(prev => prev + 1);
          initialRenderAttemptedRef.current = false;
        }}
      />
    );
  }

  console.log("Rendering Market3DVisualization with key:", renderKey);
  return (
    <Market3DVisualization
      key={`visualization-${renderKey}`}
      isSimulationMode={isSimulationMode}
      theme={theme}
      isLoading={isLoading}
      hasError={hasError}
      contextLost={contextLost}
      webGLAvailable={webGLAvailable}
      dataReady={visualizationData.length > 0}
      loadingTime={loadingTime}
      renderKey={renderKey}
      stats={stats}
      visualizationData={visualizationData}
      errorStateType={getErrorStateType()}
      onContextLost={handleContextLost}
      onContextRestored={handleContextRestored}
      onRetry={handleRetry}
      onWebGLRestore={handleWebGLRestore}
    />
  );
};

// Re-export the hook to make it accessible
export { useImprovedMarket3DView };
