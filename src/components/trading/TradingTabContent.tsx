
import { FC, useRef } from "react";
import { IndicatorSelector } from "./IndicatorSelector";
import { TradingDataPoint } from "@/utils/tradingData";
import { ChartContainer } from "./ChartContainer";

interface TradingTabContentProps {
  tabValue: "price" | "volume" | "indicators";
  data: TradingDataPoint[];
  chartType: "candles" | "line" | "area" | "bars";
  scale: number;
  indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";
  setIndicator: (indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx") => void;
  showReplayMode: boolean;
  isLoading?: boolean; // Added isLoading prop
}

export const TradingTabContent: FC<TradingTabContentProps> = ({
  tabValue,
  data,
  chartType,
  scale,
  indicator,
  setIndicator,
  showReplayMode,
  isLoading = false // Added with default value
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  if (tabValue === "indicators") {
    return (
      <div className="space-y-4">
        <IndicatorSelector 
          currentIndicator={indicator}
          onIndicatorChange={setIndicator}
        />
        
        <ChartContainer
          data={data}
          view="indicators" 
          indicator={indicator}
          chartType={chartType}
          chartContainerRef={chartContainerRef}
          scale={scale}
        />
      </div>
    );
  }

  return (
    <ChartContainer
      data={data}
      view={tabValue}
      indicator={indicator}
      chartType={chartType}
      chartContainerRef={chartContainerRef}
      scale={scale}
      showReplayMode={tabValue === "price" ? showReplayMode : undefined}
    />
  );
};
