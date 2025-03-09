
/**
 * API connection status
 */
export type ApiStatus = 'checking' | 'available' | 'unavailable';

/**
 * Trading mode
 */
export type TradingMode = 'simulation' | 'live';

/**
 * Alert level for notifications
 */
export type AlertLevel = 'info' | 'warning' | 'error' | 'success';

/**
 * Price data point with OHLCV values
 */
export interface PriceDataPoint {
  timestamp: number;
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
  date?: Date;
}

/**
 * Trading data point with additional technical indicators
 */
export interface TradingDataPoint extends PriceDataPoint {
  name: string;
  sma: number;
  ema: number;
  rsi: number;
  macd: number;
  signal: number;
  histogram: number;
  bollingerUpper: number;
  bollingerMiddle: number;
  bollingerLower: number;
  atr: number;
}

/**
 * Market data with additional sentiment information
 */
export interface EnhancedMarketData extends PriceDataPoint {
  sentiment?: number;
  volatility?: number;
  prediction?: number;
}

/**
 * Market data request parameters
 */
export interface MarketDataParams {
  symbol: string;
  interval: string;
  limit?: number;
}

/**
 * Position information for a trade
 */
export interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  quantity: number;
  leverage: number;
  timestamp: number;
  profit?: number;
  profitPercentage?: number;
}

/**
 * Market data validation result
 */
export interface MarketDataValidationResult {
  valid: boolean;
  message?: string;
  data?: PriceDataPoint[];
  error?: string;
}

/**
 * Trading chart state
 */
export interface TradingChartState {
  symbol: string;
  interval: string;
  data: PriceDataPoint[];
  loading: boolean;
  error: string | null;
  apiStatus?: ApiStatus;
  lastAPICheckTime?: number;
  apiKeysAvailable?: boolean;
  rawMarketData?: any[];
  isLoading?: boolean;
  errorCount?: number;
  lastFetchTime?: number;
}
