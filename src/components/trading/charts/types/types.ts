
export type IndicatorType = "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";

export interface ChartProps {
  data: any[];
  chartType?: "candles" | "line" | "area" | "bars";
  showDrawingTools?: boolean;
  showExtendedData?: boolean;
  secondaryIndicator?: string;
  showReplayMode?: boolean;
}
