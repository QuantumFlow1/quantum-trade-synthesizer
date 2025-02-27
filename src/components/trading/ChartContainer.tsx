
import { FC, ReactNode, RefObject } from "react";
import { ChartViews } from "./ChartViews";
import { TradingDataPoint } from "@/utils/tradingData";

interface ChartContainerProps {
  data: TradingDataPoint[];
  view: "price" | "volume" | "indicators";
  indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";
  chartType: "candles" | "line" | "area" | "bars";
  chartContainerRef: RefObject<HTMLDivElement>;
  scale: number;
  showReplayMode?: boolean;
  children?: ReactNode;
}

export const ChartContainer: FC<ChartContainerProps> = ({
  data,
  view,
  indicator,
  chartType,
  chartContainerRef,
  scale,
  showReplayMode = false,
  children
}) => {
  return (
    <div 
      ref={chartContainerRef}
      className="h-[400px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <ChartViews 
        data={data} 
        view={view} 
        indicator={indicator}
        chartType={chartType}
        showReplayMode={showReplayMode}
      />
      {children}
    </div>
  );
};
