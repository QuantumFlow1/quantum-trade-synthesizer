
import React from 'react';
import { TradingChartContent } from "./TradingChartContent";
import { TradingOrderSection } from "./TradingOrderSection";

interface StandardViewContentProps {
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  apiStatus: 'checking' | 'available' | 'unavailable';
  marketData: any;
  onSimulationToggle: (enabled: boolean) => void;
  isSimulationMode: boolean;
  apiKeysAvailable: boolean;
}

export const StandardViewContent: React.FC<StandardViewContentProps> = ({
  scale,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  apiStatus,
  marketData,
  onSimulationToggle,
  isSimulationMode,
  apiKeysAvailable
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <TradingChartContent 
          scale={scale}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
        />
      </div>

      <TradingOrderSection 
        apiStatus={apiStatus}
        marketData={marketData}
        onSimulationToggle={onSimulationToggle}
        isSimulationMode={isSimulationMode}
        apiKeysAvailable={apiKeysAvailable}
      />
    </div>
  );
};
