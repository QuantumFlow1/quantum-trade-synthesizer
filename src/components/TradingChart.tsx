
import { useState, memo } from "react";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { PriceCards } from "./trading/PriceCards";
import { ViewModeSelector, ViewModeType } from "./trading/ViewModeSelector";
import { ApiUnavailableWarning } from "./trading/ApiUnavailableWarning";
import { StandardView } from "./trading/views/StandardView";
import { CombinedView } from "./trading/views/CombinedView";
import { useTradingChartData } from "@/hooks/use-trading-chart-data";
import { useSimulationMode } from "@/hooks/use-simulation-mode";
import { Button } from "./ui/button";
import { BoxIcon } from "lucide-react";

const TradingChart = memo(() => {
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls(1);
  const [viewMode, setViewMode] = useState<ViewModeType>("standard");
  
  const {
    data,
    apiStatus,
    apiKeysAvailable,
    lastAPICheckTime,
    rawMarketData,
    handleRetryConnection,
    isLoading
  } = useTradingChartData(false);
  
  const { forceSimulation, toggleSimulationMode } = useSimulationMode(handleRetryConnection);

  const handleNavigateToVisualization = () => {
    const dashboardNavHandler = (window as any).__dashboardNavigationHandler;
    if (typeof dashboardNavHandler === 'function') {
      dashboardNavHandler('visualization');
    }
  };

  return (
    <div className="space-y-6">
      <ApiUnavailableWarning
        apiStatus={apiStatus}
        apiKeysAvailable={apiKeysAvailable}
        lastAPICheckTime={lastAPICheckTime}
        handleRetryConnection={handleRetryConnection}
      />
      
      <div className="flex justify-between items-center">
        <PriceCards data={data} />
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleNavigateToVisualization}
        >
          <BoxIcon className="h-4 w-4" /> 
          Open 3D View
        </Button>
      </div>
      
      <ViewModeSelector viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === "standard" && (
        <StandardView
          scale={scale}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          apiStatus={apiStatus}
          rawMarketData={rawMarketData}
          onSimulationToggle={toggleSimulationMode}
          isSimulationMode={forceSimulation}
          apiKeysAvailable={apiKeysAvailable}
          isLoading={isLoading}
        />
      )}
      
      {viewMode === "combined" && (
        <CombinedView
          data={data}
          scale={scale}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          apiStatus={apiStatus}
          rawMarketData={rawMarketData}
          onSimulationToggle={toggleSimulationMode}
          isSimulationMode={forceSimulation}
          apiKeysAvailable={apiKeysAvailable}
          isLoading={isLoading}
        />
      )}
    </div>
  );
});

TradingChart.displayName = "TradingChart";

export default TradingChart;
