
import { ReactNode } from 'react';
import { TradeAction } from "@/types/agent";

export interface TradingAgent {
  id: string;
  name: string;
  description: string;
  specialization: "fundamental" | "technical" | "sentiment" | "risk" | "volatility" | "macro";
  confidence: number;
  weight: number;
  performance?: {
    accuracy: number;
    recentTrades: boolean[];
    profitFactor: number;
  };
  type?: string;
}

export interface AgentRecommendation {
  agentId: string;
  action: TradeAction;
  confidence: number;
  reasoning: string;
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

export interface PortfolioManagerProps {
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
  currentData?: any;
  children?: ReactNode;
}

export interface PortfolioManagerHookReturn {
  agentRecommendations: AgentRecommendation[];
  portfolioDecision: PortfolioDecision | null;
  loadingDecision: boolean;
  riskScore: number;
  collaborationMessages: any[];
  collaborationScore: number;
  activeDiscussions: any[];
  agentPerformance: any;
  agentAccuracy: Record<string, any>;
  backtestResults: any[];
  tradingAgents: TradingAgent[];
  handleExecuteDecision: (isSimulationMode: boolean) => void;
  handleRefreshAnalysis: () => void;
}
