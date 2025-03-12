
export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'trader' | 'analyst' | 'portfolio_manager' | 'advisor' | 'receptionist' | 'value_investor' | 'fundamentals_analyst' | 'technical_analyst' | 'valuation_expert';
  status: 'active' | 'offline' | 'training' | 'paused' | 'terminated';
  lastActive: string;
  tradingStyle?: string;
  performance?: {
    successRate: number;
    tradeCount?: number;
    tasksCompleted?: number;
  };
  tasks?: {
    pending: number;
    completed: number;
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

export type AgentType = Agent['type'];
export type AgentStatus = Agent['status'];

export interface AgentRecommendation {
  agentId: string;
  action: "BUY" | "SELL" | "HOLD";
  ticker: string;
  confidence: number;
  reasoning: string;
  timestamp: string;
}

export interface PortfolioDecision {
  id: string;
  timestamp: string;
  recommendedActions: AgentRecommendation[];
  finalDecision: TradeAction;
  confidence: number;
  reasoning: string;
}

export type TradeAction = "BUY" | "SELL" | "HOLD";

// Type voor gebruik met de groqAgent
export interface GroqAgentSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enabled: boolean;
  apiKey?: string;
}
