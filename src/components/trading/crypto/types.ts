
export interface CryptoMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  id?: string;
  timestamp?: Date;
  functionCalls?: FunctionCall[];
  model?: string;
  toolCalls?: any[];
}

export interface CryptoModel {
  id: string;
  name: string;
  providerName: string;
}

export interface FunctionCall {
  name: string;
  arguments: Record<string, any>;
}

export interface CryptoNewsItem {
  title: string;
  url: string;
  source: string;
  published: string;
  summary: string;
}

export interface CryptoPriceData {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}
