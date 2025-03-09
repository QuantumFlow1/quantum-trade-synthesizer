
export interface TradingChartState {
  symbol: string;
  interval: string;
  data: PriceDataPoint[];
  loading: boolean;
  error: string | null;
  apiStatus: ApiStatus;
  lastAPICheckTime: number;
  apiKeysAvailable: boolean;
  rawMarketData: any[];
  isLoading: boolean;
  errorCount: number;
  lastFetchTime: number;
}

export type ApiStatus = 'available' | 'unavailable' | 'checking';

export interface MarketDataParams {
  symbol: string;
  interval: string;
  limit: number;
}

export interface PriceDataPoint {
  timestamp: number;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradingDataPoint extends PriceDataPoint {
  name: string;
  sma: number;
  ema: number;
  rsi: number;
  macd: number;
  signal: number;
  histogram: number;
  bollinger_upper: number;
  bollinger_middle: number;
  bollinger_lower: number;
  atr: number;
  cci: number;
  stochastic: number;
  adx: number;
  trend: string;
  // Optional properties for compatibility with existing code
  macdSignal?: number;
  macdHistogram?: number;
  bollingerUpper?: number;
  bollingerLower?: number;
  bollingerMiddle?: number;
}

export interface DataValidationResult {
  valid: boolean;
  message?: string;
  data?: PriceDataPoint[];
}

// Export type to avoid conflicts
export type { ApiStatus as ApiStatusType };
