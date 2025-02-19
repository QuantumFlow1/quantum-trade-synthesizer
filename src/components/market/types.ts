
export interface MarketData {
  symbol: string;
  market: string;
  price: number;
  volume: number;
  change24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface ChartData {
  name: string;
  volume: number;
  price: number;
  change: number;
  high: number;
  low: number;
}

