
import { TradingDataPoint } from "@/utils/tradingData";
import { PriceChart } from "./charts/PriceChart";
import { VolumeChart } from "./charts/VolumeChart";
import { IndicatorCharts } from "./charts/IndicatorCharts";
import { IndicatorType } from "./charts/types/types";

interface ChartViewsProps {
  data: TradingDataPoint[];
  view: "price" | "volume" | "indicators";
  indicator: IndicatorType;
  chartType?: "candles" | "line" | "area" | "bars";
  showDrawingTools?: boolean;
  showExtendedData?: boolean;
  secondaryIndicator?: string;
  showReplayMode?: boolean;
  isLoading?: boolean; // Added isLoading prop
}

export const ChartViews = ({ 
  data, 
  view, 
  indicator, 
  chartType = "candles",
  showDrawingTools = false,
  showExtendedData = false,
  secondaryIndicator,
  showReplayMode = false,
  isLoading = false // Added default value
}: ChartViewsProps) => {
  if (view === "price") {
    return (
      <PriceChart 
        data={data} 
        chartType={chartType} 
        showDrawingTools={showDrawingTools}
        showExtendedData={showExtendedData}
        secondaryIndicator={secondaryIndicator}
        showReplayMode={showReplayMode}
      />
    );
  }

  if (view === "volume") {
    return <VolumeChart data={data} chartType={chartType} />;
  }

  if (view === "indicators") {
    return (
      <IndicatorCharts 
        data={data} 
        indicator={indicator} 
        chartType={chartType}
        showDrawingTools={showDrawingTools}
      />
    );
  }

  return null;
};
