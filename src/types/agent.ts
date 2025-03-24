
/**
 * Represents an AI trading agent in the system
 */
export interface Agent {
  id: string;
  name: string;
  type: "trader" | "advisor" | "analyst" | "portfolio_manager" | "receptionist";
  description?: string;
  status: "active" | "idle" | "offline" | "paused" | "training" | "terminated";
  performance?: {
    successRate: number;
    tasksCompleted: number;
    tradeCount?: number;
    winLossRatio?: number;
  };
  specialization?: string;
  tradingStyle?: string;
  lastActive?: string;
  createdAt?: string;
  tasks?: {
    pending: number;
    completed: number;
  } | string[];
}

/**
 * Trading action types
 */
export type TradeAction = "BUY" | "SELL" | "HOLD" | "SHORT" | "COVER";

/**
 * Agent recommendation interface
 */
export interface AgentRecommendation {
  agentId: string;
  action: TradeAction;
  ticker: string;
  confidence: number;
  reasoning: string;
  timestamp: string;
  price?: number;
}

/**
 * Portfolio decision interface
 */
export interface PortfolioDecision {
  action: TradeAction;
  ticker: string;
  amount: number;
  price: number;
  confidence: number;
  riskScore: number;
  contributors: string[];
  reasoning: string;
  timestamp: string;
}
