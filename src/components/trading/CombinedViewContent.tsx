
import React from 'react';
import { TradingChartContent } from "./TradingChartContent";
import { Market3DView } from "../visualization/Market3DView";
import { TradingOrderSection } from "./TradingOrderSection";
import { TradingDataPoint } from "@/utils/tradingData";

interface CombinedViewContentProps {
  data: TradingDataPoint[];
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

export const CombinedViewContent: React.FC<CombinedViewContentProps> = ({
  data,
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
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradingChartContent 
          scale={scale}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
        />
        
        <Market3DView 
          data={data}
          isSimulationMode={isSimulationMode}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <TradingOrderSection 
            apiStatus={apiStatus}
            marketData={marketData}
            onSimulationToggle={onSimulationToggle}
            isSimulationMode={isSimulationMode}
            apiKeysAvailable={apiKeysAvailable}
          />
        </div>
      </div>
    </div>
  );
};
