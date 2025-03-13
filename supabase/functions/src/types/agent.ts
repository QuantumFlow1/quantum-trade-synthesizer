
export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'trader' | 'analyst' | 'portfolio_manager' | 'advisor' | 'receptionist' | 'value_investor' | 'fundamentals_analyst' | 'technical_analyst' | 'valuation_expert';
  status: 'active' | 'offline' | 'training' | 'paused' | 'terminated';
  lastActive: string;
  createdAt: string;
  tradingStyle?: string;
  specialization?: string;
  performance?: {
    successRate: number;
    tradeCount?: number;
    tasksCompleted?: number;
    winLossRatio?: number;
  };
  tasks?: {
    pending: number;
    completed: number;
  } | string[];
}

export type TradeAction = "BUY" | "SELL" | "HOLD" | "SHORT" | "COVER";

export interface AgentRecommendation {
  agentId: string;
  action: TradeAction;
  ticker: string;
  confidence: number;
  reasoning: string;
  timestamp: string;
  price?: number;
}
