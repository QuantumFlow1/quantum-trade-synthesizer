
import { ReactNode } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export interface BaseChartProps {
  data: TradingDataPoint[];
  children?: ReactNode;
}
