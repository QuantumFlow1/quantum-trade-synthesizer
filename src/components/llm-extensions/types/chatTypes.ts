
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    usedMCP?: boolean;
    contentType?: 'text' | 'json' | 'tool_use';
    isError?: boolean;
    rawContent?: any;
    [key: string]: any;
  };
}

export type EdgeFunctionStatus = 'checking' | 'available' | 'unavailable';
