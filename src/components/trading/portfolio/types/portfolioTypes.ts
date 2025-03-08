
import { ReactNode } from 'react';

// Agent recommendation type
export interface AgentRecommendation {
  agentId: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  timestamp: string;
}

// Portfolio decision type
export interface PortfolioDecision {
  action: "BUY" | "SELL" | "HOLD";
  ticker: string;
  amount: number;
  price: number;
  confidence: number;
  riskScore: number;
  contributors: string[];
  reasoning: string;
  timestamp: string;
}

// Trading agent type
export interface TradingAgent {
  id: string;
  name: string;
  icon: string;
  specialization: "fundamental" | "technical" | "sentiment" | "risk" | "volatility" | "macro";
  description: string;
  weight: number;
  confidence: number;
  successRate: number;
}

// Agent performance metrics
export interface AgentPerformance {
  successRate: number;
  recentSuccess: number[];
  averageConfidence: number;
  totalCalls: number;
}

// Agent accuracy metrics
export interface AgentAccuracy {
  overall: number;
  recent: number;
  confidence: [number, number]; // [lower, upper] confidence interval
  sampleSize: number;
  predictionHistory: Array<{
    prediction: string;
    correct: boolean;
    date: string;
  }>;
}

// Backtest result type
export interface BacktestResult {
  agentId: string;
  date: string;
  predictedAction: string;
  actualOutcome: string;
  isCorrect: boolean;
  confidence: number;
  price: number;
  priceLater: number;
}

// Collaboration message type
export interface CollaborationMessage {
  from: string;
  to: string;
  content: string;
  timestamp: string;
  impact?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

// Active discussion type
export interface ActiveDiscussion {
  topic: string;
  participants: string[];
  status: 'ongoing' | 'concluded';
}

// Return type for the usePortfolioManager hook
export interface PortfolioManagerHookReturn {
  agentRecommendations: AgentRecommendation[];
  portfolioDecision: PortfolioDecision | null;
  loadingDecision: boolean;
  riskScore?: number;
  collaborationMessages?: CollaborationMessage[];
  collaborationScore?: number;
  activeDiscussions?: ActiveDiscussion[];
  agentPerformance?: Record<string, AgentPerformance>;
  agentAccuracy?: Record<string, AgentAccuracy>;
  backtestResults?: BacktestResult[];
  tradingAgents: TradingAgent[];
  handleExecuteDecision: (isSimulationMode: boolean) => void;
  handleRefreshAnalysis: () => void;
}

// Props for the PortfolioManager component
export interface PortfolioManagerProps {
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
  currentData?: any;
  children?: ReactNode;
}
