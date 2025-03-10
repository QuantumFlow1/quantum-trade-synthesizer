
export interface CryptoModel {
  id: string;
  name: string;
  providerName: string;
}

export interface CryptoMessage {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
  model?: string;
  toolCalls?: any[];
}

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  last_updated: string;
  image?: string;
}
