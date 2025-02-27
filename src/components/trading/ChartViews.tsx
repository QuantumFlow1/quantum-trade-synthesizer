
import { TradingDataPoint } from "@/utils/tradingData";
import { PriceChart } from "./charts/PriceChart";
import { VolumeChart } from "./charts/VolumeChart";
import { IndicatorCharts } from "./charts/IndicatorCharts";

interface ChartViewsProps {
  data: TradingDataPoint[];
  view: "price" | "volume" | "indicators";
  indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";
  chartType?: "candles" | "line" | "area" | "bars";
  showDrawingTools?: boolean;
  showExtendedData?: boolean;
  secondaryIndicator?: string;
}

export const ChartViews = ({ 
  data, 
  view, 
  indicator, 
  chartType = "candles",
  showDrawingTools = false,
  showExtendedData = false,
  secondaryIndicator
}: ChartViewsProps) => {
  if (view === "price") {
    return (
      <PriceChart 
        data={data} 
        chartType={chartType} 
        showDrawingTools={showDrawingTools}
        showExtendedData={showExtendedData}
        secondaryIndicator={secondaryIndicator}
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
