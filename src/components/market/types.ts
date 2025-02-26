
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
}
