
import { ReactNode } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export interface BaseChartProps {
  data: TradingDataPoint[];
  children?: ReactNode;
}

export type IndicatorType = "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";

export interface ReplayControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  currentSpeed: number;
  progress: number;
  onProgressChange: (progress: number) => void;
}
