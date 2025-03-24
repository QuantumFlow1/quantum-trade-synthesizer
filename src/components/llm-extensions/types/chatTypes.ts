
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    usedMCP?: boolean;
    [key: string]: any;
  };
}

export type EdgeFunctionStatus = 'checking' | 'available' | 'unavailable';
