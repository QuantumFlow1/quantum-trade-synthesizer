
import { FC } from "react";
import { Market3DView } from "@/components/visualization/Market3DView";
import { TradingOrderSection } from "@/components/trading/TradingOrderSection";
import { TradingDataPoint } from "@/utils/tradingData";
import { ApiStatus } from "@/hooks/use-trading-chart-data";

interface ThreeDViewProps {
  data: TradingDataPoint[];
  apiStatus: ApiStatus;
  rawMarketData: any;
  onSimulationToggle: (enabled: boolean) => void;
  isSimulationMode: boolean;
  apiKeysAvailable: boolean;
}

export const ThreeDView: FC<ThreeDViewProps> = ({
  data,
  apiStatus,
  rawMarketData,
  onSimulationToggle,
  isSimulationMode,
  apiKeysAvailable
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Market3DView 
          data={data}
          isSimulationMode={isSimulationMode}
        />
      </div>

      <TradingOrderSection 
        apiStatus={apiStatus}
        marketData={rawMarketData}
        onSimulationToggle={onSimulationToggle}
        isSimulationMode={isSimulationMode}
        apiKeysAvailable={apiKeysAvailable}
      />
    </div>
  );
};
