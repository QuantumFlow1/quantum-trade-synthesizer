
export interface MarketData {
  timestamp: number;
  open: number;
  high: number;
  volume: number;
  close: number;
  low: number;
}

export interface TradeSetup {
  type: 'long' | 'short';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  strategy: string;
  timestamp: number;
}

export interface BacktestConfig {
  initialCapital: number;
  warmup: number;
  riskPerTrade: number;
}

export interface TradeResult {
  entry: number;
  exit: number;
  pnl: number;
  type: 'long' | 'short';
  timestamp: number;
  strategy: string;
}

export interface BacktestResults {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: TradeResult[];
}

export interface Strategy {
  analyze(data: MarketData[]): Promise<TradeSetup[]>;
  train?(historicalData: MarketData[]): Promise<void>;
}

export interface Position {
  id: string;
  type: 'long' | 'short';
  entry: number;
  size: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: number;
  status: 'open' | 'closed';
  pnl?: number;
  exitPrice?: number;
}

export interface TradingConfig {
  maxPositions: number;
  maxRiskPerTrade: number;
  maxDrawdown: number;
  trailingStopDistance?: number;
}
