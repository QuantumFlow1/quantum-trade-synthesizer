
export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'trader' | 'analyst' | 'portfolio_manager';
  status: 'active' | 'offline' | 'training';
  lastActive: string;
  tradingStyle?: string;
  performance?: {
    successRate: number;
    tradeCount?: number;
  };
}

export interface AgentToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}
