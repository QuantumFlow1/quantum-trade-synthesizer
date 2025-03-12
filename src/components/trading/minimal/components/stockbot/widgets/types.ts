
// Common types for Stockbot widgets

export interface TradingViewChartProps {
  symbol: string;
  timeframe?: string;
}

export interface MarketHeatmapProps {
  sector?: string;
}

export interface StockNewsProps {
  symbol: string;
  count?: number;
}

export interface SentimentAnalysisProps {
  symbol: string;
  timeframe?: string;
}

export interface MarketTrendProps {
  symbol: string;
  timeframe?: string;
}
