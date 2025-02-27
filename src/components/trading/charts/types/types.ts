
export type IndicatorType = "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";

export interface ChartProps {
  data: any[];
  chartType?: "candles" | "line" | "area" | "bars";
  showDrawingTools?: boolean;
  showExtendedData?: boolean;
  secondaryIndicator?: string;
  showReplayMode?: boolean;
}

export type DrawingToolType = "line" | "arrow" | "horizontal" | "rectangle" | "circle" | "fibonacci" | "pencil" | "none";

export interface BaseChartProps {
  data: any[];
  children?: React.ReactNode;
}

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
