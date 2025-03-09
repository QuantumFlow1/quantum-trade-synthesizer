
export interface Agent {
  id: string;
  name: string;
  status: "active" | "paused" | "terminated";
  type: "receptionist" | "advisor" | "trader" | "analyst" | "portfolio_manager" | "value_investor" | "technical_analyst" | "fundamentals_analyst" | "valuation_expert";
  specialization?: string;
  description: string;
  createdAt: string;
  lastActive: string;
  tasks?: string[];
  tradingStyle?: string;
  performance?: {
    successRate: number;
    tasksCompleted: number;
    winLossRatio?: number;
  };
}

export type TradeAction = "BUY" | "SELL" | "HOLD" | "SHORT" | "COVER";

export interface AgentRecommendation {
  agentId: string;
  action: TradeAction;
  confidence: number;
  reasoning: string;
  ticker?: string;
  price?: number;
  timestamp: string;
}

export interface PortfolioDecision {
  action: TradeAction;
  ticker: string;
  amount: number;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
  confidence: number;
  riskScore: number;
  contributors: string[];
  reasoning: string;
  timestamp: string;
}
