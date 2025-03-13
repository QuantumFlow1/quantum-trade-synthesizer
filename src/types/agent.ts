
export type AgentType = 'advisor' | 'trader' | 'analyst' | 'receptionist' | 'portfolio_manager' | 'value_investor' | 'fundamentals_analyst' | 'technical_analyst' | 'valuation_expert';
export type AgentStatus = 'active' | 'paused' | 'maintenance' | 'terminated' | 'offline' | 'training';

export interface AgentPerformance {
  successRate: number;
  tasksCompleted: number;
  tradeCount?: number;
  winLossRatio?: number;
}

export interface AgentTasks {
  completed: number;
  pending: number;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  description: string;
  performance?: AgentPerformance;
  tasks?: AgentTasks | string[];
  tradingStyle?: string;
  specialization?: string;
  lastActive?: string;
  createdAt?: string;
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

export interface PortfolioDecision {
  action: TradeAction;
  ticker: string;
  amount: number;
  price: number;
  confidence?: number;
  riskScore?: number;
  contributors?: string[];
  reasoning?: string;
  timestamp: string;
  stopLoss?: number;
  takeProfit?: number;
}
