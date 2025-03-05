
import { useState } from "react";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { PriceCards } from "./trading/PriceCards";
import { useTradingChartData } from "@/hooks/use-trading-chart-data";
import { ApiConnectionWarning } from "./trading/ApiConnectionWarning";
import { ViewModeTabs } from "./trading/ViewModeTabs";
import { StandardViewContent } from "./trading/StandardViewContent";
import { ThreeDViewContent } from "./trading/ThreeDViewContent";
import { CombinedViewContent } from "./trading/CombinedViewContent";
import { toast } from "@/hooks/use-toast";

const TradingChart = () => {
  const [forceSimulation, setForceSimulation] = useState(false);
  const [viewMode, setViewMode] = useState<"standard" | "3d" | "combined">("standard");
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls(1);
  
  const {
    data,
    apiStatus,
    lastAPICheckTime,
    apiKeysAvailable,
    rawMarketData,
    handleRetryConnection
  } = useTradingChartData(forceSimulation);

  const toggleSimulationMode = (enabled: boolean) => {
    setForceSimulation(enabled);
    
    if (enabled) {
      toast({
        title: "Simulation Mode Enabled",
        description: "Using simulated data for trading functionality.",
        variant: "default",
      });
    } else {
      handleRetryConnection();
    }
  };

  return (
    <div className="space-y-6">
      <ApiConnectionWarning
        apiStatus={apiStatus}
        apiKeysAvailable={apiKeysAvailable}
        lastAPICheckTime={lastAPICheckTime}
        onRetryConnection={handleRetryConnection}
      />
      
      <PriceCards data={data} />
      
      <ViewModeTabs
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === "standard" && (
        <StandardViewContent
          scale={scale}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          apiStatus={apiStatus}
          marketData={rawMarketData}
          onSimulationToggle={toggleSimulationMode}
          isSimulationMode={forceSimulation}
          apiKeysAvailable={apiKeysAvailable}
        />
      )}
      
      {viewMode === "3d" && (
        <ThreeDViewContent
          data={data}
          apiStatus={apiStatus}
          marketData={rawMarketData}
          onSimulationToggle={toggleSimulationMode}
          isSimulationMode={forceSimulation}
          apiKeysAvailable={apiKeysAvailable}
        />
      )}
      
      {viewMode === "combined" && (
        <CombinedViewContent
          data={data}
          scale={scale}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          apiStatus={apiStatus}
          marketData={rawMarketData}
          onSimulationToggle={toggleSimulationMode}
          isSimulationMode={forceSimulation}
          apiKeysAvailable={apiKeysAvailable}
        />
      )}
    </div>
  );
};

export default TradingChart;
