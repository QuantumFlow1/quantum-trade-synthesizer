
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
  symbol: string; // Ensuring symbol property is here
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
  verified: boolean;  // Indicates if token is verified/trusted
  decimals: number;   // Token decimals for accurate calculations
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

// ChartData interface definition
export interface ChartData {
  name: string;
  price: number;
  volume: number;
  change?: number;
  high: number;
  low: number;
}

// New interfaces for profit/loss tracking

export interface ProfitLossRecord {
  id: string;
  tradeId: string;
  timestamp: number;
  realized: number;    // Realized P&L amount
  unrealized: number;  // Unrealized P&L amount 
  percentage: number;  // P&L as percentage of investment
  assetSymbol: string; // Symbol of the asset traded
  entryPrice: number;  // Price at which position was opened
  currentPrice: number;// Current price of the asset
  quantity: number;    // Quantity of the asset
  costBasis: number;   // Total cost of investment
  currentValue: number;// Current value of investment
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

