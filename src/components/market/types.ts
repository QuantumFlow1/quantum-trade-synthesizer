export interface TradeSignal {
  type: 'LONG' | 'SHORT';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
}

export interface MarketData {
  timestamp: number;
  price: number;
  volume: number;
  high: number;
  low: number;
  market?: string;
  change24h?: number;
  high24h?: number;
  low24h?: number;
  symbol: string;
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
}

export interface TradeOrder {
  type: "buy" | "sell";
  orderType: "market" | "limit" | "stop" | "stop_limit";
  amount: number;
  price: number;
  limitPrice?: number;
  stopPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface TokenData {
  symbol: string;
  name: string;
  balance: string;
  network: string;
  address: string;
  verified: boolean;
  decimals: number;
  tokenType?: 'ERC20' | 'ERC721' | 'ERC1155' | 'BEP20' | 'Other';
}

export interface SecureTransaction {
  hash: string;
  nonce: number;
  from: string;
  to: string;
  value: string;
  data?: string;
  signature?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  gasLimit?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface ChartData {
  name: string;
  price: number;
  volume: number;
  change?: number;
  high: number;
  low: number;
}

export interface ProfitLossRecord {
  id: string;
  tradeId: string;
  timestamp: number;
  realized: number;
  unrealized: number;
  percentage: number;
  assetSymbol: string;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  costBasis: number;
  currentValue: number;
  status: 'open' | 'closed';
}

export interface TradeHistoryItem {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  totalValue: number;
  fees?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalProfitLoss: number;
  percentageChange: number;
  timeframe: '24h' | '7d' | '30d' | 'all';
  holdings: {
    symbol: string;
    amount: number;
    value: number;
    profitLoss: number;
    percentageChange: number;
  }[];
}

export interface MarketOverviewData {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
  activeCoins: number;
  trending: MarketData[];
}

export interface TimeframeOption {
  label: string;
  value: '1h' | '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
  active: boolean;
}

export interface MarketCategory {
  id: string;
  name: string;
  marketCap: number;
  volume24h: number;
  change24h: number;
  coins: number;
}

export interface MarketTrend {
  category: string;
  performance: number;
  topGainers: { symbol: string; change: number }[];
  topLosers: { symbol: string; change: number }[];
}
