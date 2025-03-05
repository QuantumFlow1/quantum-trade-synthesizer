
import React from 'react';
import { Market3DView } from "../visualization/Market3DView";
import { TradingOrderSection } from "./TradingOrderSection";
import { TradingDataPoint } from "@/utils/tradingData";

interface ThreeDViewContentProps {
  data: TradingDataPoint[];
  apiStatus: 'checking' | 'available' | 'unavailable';
  marketData: any;
  onSimulationToggle: (enabled: boolean) => void;
  isSimulationMode: boolean;
  apiKeysAvailable: boolean;
}

export const ThreeDViewContent: React.FC<ThreeDViewContentProps> = ({
  data,
  apiStatus,
  marketData,
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
        marketData={marketData}
        onSimulationToggle={onSimulationToggle}
        isSimulationMode={isSimulationMode}
        apiKeysAvailable={apiKeysAvailable}
      />
    </div>
  );
};
