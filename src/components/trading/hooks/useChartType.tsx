
import { ReactNode } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { CandleStickChart } from "../charts/types/CandleStickChart";
import { LineChart } from "../charts/types/LineChart";
import { AreaChart } from "../charts/types/AreaChart";
import { BarChart } from "../charts/types/BarChart";

export const useChartType = (data: TradingDataPoint[], chartType: "candles" | "line" | "area" | "bars") => {
  const renderChart = (additionalComponent?: () => ReactNode) => {
    switch (chartType) {
      case "candles":
        return (
          <CandleStickChart data={data}>
            {additionalComponent && additionalComponent()}
          </CandleStickChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            {additionalComponent && additionalComponent()}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            {additionalComponent && additionalComponent()}
          </AreaChart>
        );
      case "bars":
        return (
          <BarChart data={data}>
            {additionalComponent && additionalComponent()}
          </BarChart>
        );
      default:
        return (
          <CandleStickChart data={data}>
            {additionalComponent && additionalComponent()}
          </CandleStickChart>
        );
    }
  };

  return { renderChart };
};
