
import { TradingDataPoint } from "@/utils/tradingData";
import { useCallback } from "react";
import { CandleStickChart } from "../charts/types/CandleStickChart";
import { LineChart } from "../charts/types/LineChart";
import { AreaChart } from "../charts/types/AreaChart";
import { BarChart } from "../charts/types/BarChart";

export function useChartType(data: TradingDataPoint[], chartType: "candles" | "line" | "area" | "bars") {
  const renderChart = useCallback(() => {
    switch (chartType) {
      case "candles":
        return <CandleStickChart data={data} />;
      case "line":
        return <LineChart data={data} />;
      case "area":
        return <AreaChart data={data} />;
      case "bars":
        return <BarChart data={data} />;
      default:
        return <LineChart data={data} />;
    }
  }, [data, chartType]);

  return { renderChart };
}
