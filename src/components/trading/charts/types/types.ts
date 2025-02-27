
import { ReactNode } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export interface BaseChartProps {
  data: TradingDataPoint[];
  children?: ReactNode;
}

export type IndicatorType = "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";
