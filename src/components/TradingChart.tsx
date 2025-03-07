
import { useState } from "react";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { PriceCards } from "./trading/PriceCards";
import { ViewModeSelector, ViewModeType } from "./trading/ViewModeSelector";
import { ApiUnavailableWarning } from "./trading/ApiUnavailableWarning";
import { StandardView } from "./trading/views/StandardView";
import { CombinedView } from "./trading/views/CombinedView";
import { useTradingChartData } from "@/hooks/use-trading-chart-data";
import { useSimulationMode } from "@/hooks/use-simulation-mode";
import { Button } from "./ui/button";
import { Cube } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TradingChart = () => {
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls(1);
  const [viewMode, setViewMode] = useState<ViewModeType>("standard");
  const navigate = useNavigate();
  
  // Use our extracted hook for API and data fetching
  const {
    data,
    apiStatus,
    apiKeysAvailable,
    lastAPICheckTime,
    rawMarketData,
    handleRetryConnection
  } = useTradingChartData(false);
  
  // Use our simulation mode hook
  const { forceSimulation, toggleSimulationMode } = useSimulationMode(handleRetryConnection);

  const handleNavigateToVisualization = () => {
    // Set state on the dashboard to change to visualization page
    const dashboardNavHandler = (window as any).__dashboardNavigationHandler;
    if (typeof dashboardNavHandler === 'function') {
      dashboardNavHandler('visualization');
    }
  };

  return (
    <div className="space-y-6">
      {/* API Unavailable Warning */}
      <ApiUnavailableWarning
        apiStatus={apiStatus}
        apiKeysAvailable={apiKeysAvailable}
        lastAPICheckTime={lastAPICheckTime}
        handleRetryConnection={handleRetryConnection}
      />
      
      {/* Price Cards */}
      <div className="flex justify-between items-center">
        <PriceCards data={data} />
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleNavigateToVisualization}
        >
          <Cube className="h-4 w-4" /> 
          Open 3D View
        </Button>
      </div>
      
      {/* View Mode Selector */}
      <ViewModeSelector viewMode={viewMode} setViewMode={setViewMode} />

      {/* Render the selected view */}
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
        />
      )}
    </div>
  );
};

export default TradingChart;
