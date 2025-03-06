
import { useState } from "react";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { PriceCards } from "./trading/PriceCards";
import { ViewModeSelector, ViewModeType } from "./trading/ViewModeSelector";
import { ApiUnavailableWarning } from "./trading/ApiUnavailableWarning";
import { StandardView } from "./trading/views/StandardView";
import { ThreeDView } from "./trading/views/ThreeDView";
import { CombinedView } from "./trading/views/CombinedView";
import { useTradingChartData } from "@/hooks/use-trading-chart-data";
import { useSimulationMode } from "@/hooks/use-simulation-mode";

const TradingChart = () => {
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls(1);
  const [viewMode, setViewMode] = useState<ViewModeType>("standard");
  
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
      <PriceCards data={data} />
      
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
      
      {viewMode === "3d" && (
        <ThreeDView
          data={data}
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
