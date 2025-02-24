
import { TradingDataPoint } from "@/utils/tradingData";
import { PriceChart } from "./charts/PriceChart";
import { VolumeChart } from "./charts/VolumeChart";
import { IndicatorCharts } from "./charts/IndicatorCharts";

interface ChartViewsProps {
  data: TradingDataPoint[];
  view: "price" | "volume" | "indicators";
  indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";
}

export const ChartViews = ({ data, view, indicator }: ChartViewsProps) => {
  if (view === "price") {
    return <PriceChart data={data} />;
  }

  if (view === "volume") {
    return <VolumeChart data={data} />;
  }

  if (view === "indicators") {
    return <IndicatorCharts data={data} indicator={indicator} />;
  }

  return null;
};

