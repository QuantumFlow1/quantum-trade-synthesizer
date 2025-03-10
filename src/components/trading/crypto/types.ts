
export interface CryptoMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  functionCalls?: FunctionCall[];
}

export interface FunctionCall {
  name: string;
  arguments: Record<string, any>;
}

export interface CryptoModelOption {
  id: string;
  name: string;
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
