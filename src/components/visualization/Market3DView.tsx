
import { useRef, useState, useEffect } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { useMarket3DData } from "@/hooks/use-market-3d-data";
import { Market3DInitializing } from "./3d/Market3DInitializing";
import { Market3DVisualization } from "./3d/Market3DVisualization";

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

  // Start rendering with a slight delay to avoid blocking main thread
  useEffect(() => {
    if (visualizationData.length > 0 && !initialRenderAttemptedRef.current && mountedRef.current) {
      initialRenderAttemptedRef.current = true;
      
      // Set rendering started immediately to avoid flickering
      setRenderingStarted(true);
      
      // Force a re-render with a new key after a small delay
      const timer = setTimeout(() => {
        if (mountedRef.current) {
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
    return (
      <Market3DInitializing
        isSimulationMode={isSimulationMode}
        onRetry={() => {
          setRenderKey(prev => prev + 1);
          initialRenderAttemptedRef.current = false;
        }}
      />
    );
  }

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

// New improved hook that combines functionality from our existing hooks
function useImprovedMarket3DView({ 
  visualizationData, 
  onError, 
  onLoaded 
}: { 
  visualizationData: TradingDataPoint[],
  onError?: () => void,
  onLoaded?: () => void
}) {
  const theme = useThemeDetection();
  const [dataReady, setDataReady] = useState(false);
  const [renderAttempts, setRenderAttempts] = useState(0);
  const mountedRef = useRef(true);
  
  // Use the WebGL state hook for core functionality
  const {
    isLoading,
    hasError,
    webGLAvailable,
    contextLost,
    loadingTime,
    handleContextLost,
    handleContextRestored,
    handleRetry: baseHandleRetry,
    setIsLoading
  } = useWebGLState();

  // Check if data is ready for rendering
  useEffect(() => {
    if (visualizationData.length > 0 && mountedRef.current) {
      setDataReady(true);
    }
  }, [visualizationData]);

  // Notify parent components of errors
  useEffect(() => {
    if ((hasError || contextLost || !webGLAvailable) && renderAttempts < 2 && mountedRef.current) {
      console.log("3D View error state detected:", { hasError, contextLost, webGLAvailable });
      setRenderAttempts(prev => prev + 1);
      onError?.();
    }
  }, [hasError, contextLost, webGLAvailable, onError, renderAttempts]);

  // Notify parent when loading is done
  useEffect(() => {
    if (!isLoading && !hasError && webGLAvailable && !contextLost && dataReady && mountedRef.current) {
      console.log("3D View loaded successfully");
      onLoaded?.();
    }
  }, [isLoading, hasError, webGLAvailable, contextLost, dataReady, onLoaded]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Handle WebGL context restoration
  const handleWebGLRestore = () => {
    console.log("Attempting to restore WebGL context");
    handleContextRestored();
    
    if (mountedRef.current) {
      // Reset loading state to trigger re-creation
      setIsLoading(true);
      setTimeout(() => {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }, 100);
    }
  };

  // Enhanced retry function with attempt tracking
  const handleRetry = () => {
    if (renderAttempts < 3 && mountedRef.current) {
      setRenderAttempts(prev => prev + 1);
      baseHandleRetry();
    }
  };

  // Determine which error state to show
  const getErrorStateType = () => {
    if (contextLost) return 'context-lost';
    if (!webGLAvailable) return 'unsupported';
    return 'error';
  };

  return {
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
    getErrorStateType,
    dataReady,
    renderAttempts
  };
}

// Re-export the hook to make it accessible
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { useWebGLState } from "@/hooks/use-webgl-state";
export { useImprovedMarket3DView };
