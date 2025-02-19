
export type AgentType = "trading" | "analysis" | "risk" | "finance" | "compliance" | "security" | "legal" | "market_analysis" | "portfolio_risk";

export interface TradeSignal {
  pair: string;
  direction: "long" | "short";
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  timestamp: string;
}

export interface AgentMetrics {
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  successfulTrades: number;
}

export interface Agent {
  id: string;
  name: string;
  status: "active" | "paused" | "terminated";
  type: AgentType;
  performance: string;
  lastActive: string;
  department: string;
  expertise: string[];
  capabilities?: string[];
  riskLevel?: "low" | "medium" | "high";
  // Nieuwe trading-specifieke velden
  tradeHistory?: TradeSignal[];
  metrics?: AgentMetrics;
  allowedPairs?: string[];
  maxPositionSize?: number;
  currentPositions?: number;
  tradingStrategy?: string;
  technicalIndicators?: string[];
}
