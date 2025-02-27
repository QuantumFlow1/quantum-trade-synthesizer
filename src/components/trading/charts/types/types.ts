
import { ReactNode } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export interface BaseChartProps {
  data: TradingDataPoint[];
  children?: ReactNode;
}

export type IndicatorType = "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";

export type DrawingToolType = "line" | "arrow" | "horizontal" | "rectangle" | "circle" | "fibonacci" | "pencil" | "none";

export interface ReplayControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  currentSpeed: number;
  progress: number;
  onProgressChange: (progress: number) => void;
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}
