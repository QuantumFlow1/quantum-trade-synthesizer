
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
