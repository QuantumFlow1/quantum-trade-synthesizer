
export interface TradingDataPoint {
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma: number;
  ema: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  bollingerUpper: number;
  bollingerLower: number;
  stochastic: number;
  adx: number;
  trend: "up" | "down";
}
