
export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'trader' | 'analyst' | 'portfolio_manager' | 'advisor' | 'receptionist' | 'value_investor' | 'fundamentals_analyst' | 'technical_analyst' | 'valuation_expert';
  status: 'active' | 'offline' | 'training' | 'paused' | 'terminated';
  lastActive: string;
  tradingStyle?: string;
  specialization?: string;
  createdAt?: string;
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

export interface AgentToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export type AgentType = Agent['type'];
export type AgentStatus = Agent['status'];

export interface AgentRecommendation {
  agentId: string;
  action: "BUY" | "SELL" | "HOLD" | "SHORT" | "COVER";
  ticker: string;
  confidence: number;
  reasoning: string;
  timestamp: string;
  price?: number;
}

export type TradeAction = "BUY" | "SELL" | "HOLD" | "SHORT" | "COVER";

export interface PortfolioDecision {
  id: string;
  timestamp: string;
  recommendedActions: AgentRecommendation[];
  finalDecision: TradeAction;
  confidence: number;
  reasoning: string;
  ticker: string;
  amount: number;
  price: number;
  riskScore: number;
  action?: TradeAction;  // Kept for backward compatibility
  stopLoss?: number;
  takeProfit?: number;
  contributors?: string[];
}

// Type voor gebruik met de groqAgent
export interface GroqAgentSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enabled: boolean;
  apiKey?: string;
}
