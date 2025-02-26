
export interface ChartData {
  name: string;
  volume: number;
  price: number;
  change?: number;
  high?: number;
  low?: number;
}

export interface MarketData {
  market: string;
  symbol: string;
  price: number;
  volume: number;
  change24h: number;
  high24h: number;
  low24h: number;
  timestamp?: string;
}
