
import React, { useEffect, useState } from "react";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { useTradingChartData } from "@/components/trading/hooks/use-trading-chart-data";
import { ViewModeTabs } from "@/components/trading/ViewModeTabs";
import { StandardViewContent } from "@/components/trading/StandardViewContent";
import { ThreeDViewContent } from "@/components/trading/ThreeDViewContent";
import { CombinedViewContent } from "@/components/trading/CombinedViewContent";
import { ApiStatusIndicator } from "@/components/trading/ApiStatusIndicator";
import { ZoomControlPanel } from "@/components/trading/ZoomControlPanel";
import { useViewMode } from "@/hooks/use-view-mode";
import { SimulationToggle } from "@/components/trading/SimulationToggle";

const TradingChart = () => {
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls();
  const { viewMode, handleViewModeChange } = useViewMode();
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  
  const { 
    data, 
    marketData, 
    fetchData, 
    apiStatus,
    apiKeysAvailable
  } = useTradingChartData();

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Simulation mode toggle handler
  const handleSimulationToggle = (enabled: boolean) => {
    setIsSimulationMode(enabled);
  };

  return (
    <div className="p-4 rounded-xl backdrop-blur-sm bg-background/60 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Market Analysis</h2>
        <SimulationToggle 
          enabled={isSimulationMode} 
          onToggle={handleSimulationToggle} 
        />
      </div>

      <ApiStatusIndicator 
        apiStatus={apiStatus} 
        isSimulationMode={isSimulationMode} 
      />

      <ZoomControlPanel 
        scale={scale}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleResetZoom={handleResetZoom}
      />

      <ViewModeTabs 
        viewMode={viewMode} 
        onViewModeChange={handleViewModeChange} 
      />

      {viewMode === "standard" && (
        <StandardViewContent 
          scale={scale}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          apiStatus={apiStatus}
          marketData={marketData}
          onSimulationToggle={handleSimulationToggle}
          isSimulationMode={isSimulationMode}
          apiKeysAvailable={apiKeysAvailable}
        />
      )}

      {viewMode === "3d" && (
        <ThreeDViewContent 
          data={data}
          apiStatus={apiStatus}
          marketData={marketData}
          onSimulationToggle={handleSimulationToggle}
          isSimulationMode={isSimulationMode}
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
          marketData={marketData}
          onSimulationToggle={handleSimulationToggle}
          isSimulationMode={isSimulationMode}
          apiKeysAvailable={apiKeysAvailable}
        />
      )}
    </div>
  );
};

export default TradingChart;
