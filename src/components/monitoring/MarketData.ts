
export interface MarketData {
  price: number;
  symbol: string;
  timestamp: number;
  volume: number;
  high: number;
  low: number;
  market?: string;
  change24h?: number;
  high24h?: number;
  low24h?: number;
  name?: string;
  marketCap?: number;
  totalVolume24h?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  rank?: number;
  ath?: number;
  athDate?: string;
  atl?: number;
  atlDate?: string;
  lastUpdated?: string;
  priceChange7d?: number;
  priceChange30d?: number;
  change7d?: number;
  change30d?: number;
}
