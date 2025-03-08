
import { AgentRecommendation, PortfolioDecision, TradeAction } from "@/types/agent";

// Define agent types with their specializations and weights
export interface TradingAgent {
  id: string;
  name: string;
  specialization: string;
  description: string;
  weight: number; // Performance weight (0-100)
  successRate: number; // Historical success rate
  contributionScore: number; // How valuable its input has been
}

// Add collaboration message interface
export interface AgentCollaborationMessage {
  from: string;
  to: string;
  content: string;
  timestamp: string;
  impact?: number; // Impact score of this message (0-100)
  sentiment?: 'positive' | 'neutral' | 'negative';
}

// New interfaces for accuracy metrics
export interface AgentAccuracy {
  overall: number; // Overall historical accuracy percentage
  recent: number; // Recent accuracy percentage
  confidence: [number, number]; // Confidence interval [lower, upper]
  predictionHistory: Array<{correct: boolean, date: string, prediction: string}>; // Historical predictions
}

export interface BacktestResult {
  agentId: string;
  predictedAction: TradeAction;
  actualOutcome: TradeAction;
  isCorrect: boolean;
  date: string;
  confidence: number;
  price: number;
  priceLater: number; // Price after the test period
}

export interface PortfolioManagerState {
  agentRecommendations: AgentRecommendation[];
  portfolioDecision: PortfolioDecision | null;
  loadingDecision: boolean;
  riskScore: number;
  collaborationMessages: AgentCollaborationMessage[];
  agentPerformance: Record<string, number>;
  collaborationScore: number;
  agentAccuracy: Record<string, AgentAccuracy>;
  activeDiscussions: Array<{topic: string, participants: string[], status: 'ongoing' | 'concluded'}>;
  backtestResults: BacktestResult[];
}

export interface PortfolioManagerHookReturn extends PortfolioManagerState {
  tradingAgents: TradingAgent[];
  handleExecuteDecision: (isSimulationMode: boolean) => void;
  handleRefreshAnalysis: () => void;
}
