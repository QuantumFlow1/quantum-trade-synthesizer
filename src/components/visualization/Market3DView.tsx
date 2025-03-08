
import { TradingDataPoint } from "@/utils/tradingData";
import { useMarket3DView } from "@/hooks/use-market-3d-view";
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
  } = useMarket3DView({ data, onError, onLoaded });
  
  // Don't render anything until we're ready to start rendering
  if (!renderingStarted) {
    return (
      <Market3DInitializing
        isSimulationMode={isSimulationMode}
        onRetry={handleForceRestart}
      />
    );
  }
  
  return (
    <Market3DVisualization
      isSimulationMode={isSimulationMode}
      theme={theme}
      isLoading={isLoading}
      hasError={hasError}
      contextLost={contextLost}
      webGLAvailable={webGLAvailable}
      dataReady={dataReady}
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
