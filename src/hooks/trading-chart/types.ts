
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
