
import { FC } from "react";
import { TradingChartContent } from "@/components/trading/TradingChartContent";
import { Market3DView } from "@/components/visualization/Market3DView";
import { TradingOrderSection } from "@/components/trading/TradingOrderSection";
import { TradingDataPoint } from "@/utils/tradingData";
import { ApiStatus } from "@/hooks/use-trading-chart-data";

interface CombinedViewProps {
  data: TradingDataPoint[];
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  apiStatus: ApiStatus;
  rawMarketData: any;
  onSimulationToggle: (enabled: boolean) => void;
  isSimulationMode: boolean;
  apiKeysAvailable: boolean;
}

export const CombinedView: FC<CombinedViewProps> = ({
  data,
  scale,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  apiStatus,
  rawMarketData,
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
            marketData={rawMarketData}
            onSimulationToggle={onSimulationToggle}
            isSimulationMode={isSimulationMode}
            apiKeysAvailable={apiKeysAvailable}
          />
        </div>
      </div>
    </div>
  );
};
