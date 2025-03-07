
import { FC } from "react";
import { TradingChartContent } from "@/components/trading/TradingChartContent";
import { TradingOrderSection } from "@/components/trading/TradingOrderSection";
import { ApiStatus } from "@/hooks/use-trading-chart-data";

interface StandardViewProps {
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  apiStatus: ApiStatus;
  rawMarketData: any;
  onSimulationToggle: (enabled: boolean) => void;
  isSimulationMode: boolean;
  apiKeysAvailable: boolean;
  isLoading?: boolean; // Added isLoading prop
}

export const StandardView: FC<StandardViewProps> = ({
  scale,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  apiStatus,
  rawMarketData,
  onSimulationToggle,
  isSimulationMode,
  apiKeysAvailable,
  isLoading = false // Set default value
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <TradingChartContent 
          scale={scale}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          isLoading={isLoading}
        />
      </div>

      <TradingOrderSection 
        apiStatus={apiStatus}
        marketData={rawMarketData}
        onSimulationToggle={onSimulationToggle}
        isSimulationMode={isSimulationMode}
        apiKeysAvailable={apiKeysAvailable}
        isLoading={isLoading}
      />
    </div>
  );
};
