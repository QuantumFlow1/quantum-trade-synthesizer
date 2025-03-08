
import { useState } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { ChartControls } from "./chart-components/ChartControls";
import { MainPriceChart } from "./chart-components/MainPriceChart";
import { IndicatorsSection } from "./chart-components/IndicatorsSection";

interface MinimalPriceChartProps {
  data: TradingDataPoint[];
}

export const MinimalPriceChart = ({ data }: MinimalPriceChartProps) => {
  const [showVolume, setShowVolume] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);
  
  if (!data || data.length === 0) {
    return <div className="h-[400px] flex items-center justify-center">No data available</div>;
  }

  return (
    <div className="space-y-4">
      <ChartControls
        showVolume={showVolume}
        setShowVolume={setShowVolume}
        showIndicators={showIndicators}
        setShowIndicators={setShowIndicators}
      />
      
      <MainPriceChart 
        data={data} 
        showVolume={showVolume} 
        showIndicators={showIndicators} 
      />
      
      <IndicatorsSection 
        data={data} 
        showIndicators={showIndicators} 
      />
    </div>
  );
};
