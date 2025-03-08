
import { useState, useEffect, useRef } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { useWebGLState } from "@/hooks/use-webgl-state";
import { useMarket3DData } from "@/hooks/use-market-3d-data";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { toast } from "@/hooks/use-toast";

interface UseMarket3DViewProps {
  data: TradingDataPoint[];
  onError?: () => void;
  onLoaded?: () => void;
}

export const useMarket3DView = ({ data, onError, onLoaded }: UseMarket3DViewProps) => {
  const { visualizationData, stats } = useMarket3DData(data);
  const theme = useThemeDetection();
  const [renderingStarted, setRenderingStarted] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
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

  return {
    visualizationData,
    stats,
    theme,
    renderingStarted,
    dataReady,
    renderKey,
    isLoading,
    hasError,
    webGLAvailable,
    contextLost,
    loadingTime,
    handleContextLost,
    handleContextRestored,
    handleRetry,
    handleWebGLRestore,
    handleForceRestart,
    getErrorStateType
  };
};
