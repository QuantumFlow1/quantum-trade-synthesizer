
// Types for trading chart data
export type ApiStatus = 'checking' | 'available' | 'unavailable';

export interface TradingChartState {
  data: any[];
  apiStatus: ApiStatus;
  lastAPICheckTime: Date | null;
  apiKeysAvailable: boolean;
  rawMarketData: any;
  isLoading: boolean;
  errorCount: number;
  lastFetchTime: Date | null;
}

export interface TradingChartActions {
  handleRetryConnection: () => Promise<void>;
  fetchMarketData: () => Promise<any[]>;
}

export interface MarketDataValidationResult {
  valid: boolean;
  data: any[] | null;
  error?: string;
}
