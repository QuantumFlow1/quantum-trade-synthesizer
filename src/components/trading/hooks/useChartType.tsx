
import { ReactNode } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { CandleStickChart } from "../charts/types/CandleStickChart";
import { LineChart } from "../charts/types/LineChart";
import { AreaChart } from "../charts/types/AreaChart";
import { BarChart } from "../charts/types/BarChart";

export const useChartType = (data: TradingDataPoint[], chartType: "candles" | "line" | "area" | "bars") => {
  const renderChart = (additionalComponent?: () => ReactNode, replayData?: TradingDataPoint[]) => {
    // Use replay data if provided, otherwise use the original data
    const chartData = replayData || data;
    
    switch (chartType) {
      case "candles":
        return (
          <CandleStickChart data={chartData}>
            {additionalComponent && additionalComponent()}
          </CandleStickChart>
        );
      case "line":
        return (
          <LineChart data={chartData}>
            {additionalComponent && additionalComponent()}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={chartData}>
            {additionalComponent && additionalComponent()}
          </AreaChart>
        );
      case "bars":
        return (
          <BarChart data={chartData}>
            {additionalComponent && additionalComponent()}
          </BarChart>
        );
      default:
        return (
          <CandleStickChart data={chartData}>
            {additionalComponent && additionalComponent()}
          </CandleStickChart>
        );
    }
  };

  return { renderChart };
};
