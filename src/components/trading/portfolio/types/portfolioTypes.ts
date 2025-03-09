
export interface PortfolioManagerProps {
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
  currentData?: any;
  children?: React.ReactNode;
}

export interface AgentRecommendation {
  agentId: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  timestamp: string;
}

export interface PortfolioDecision {
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  contributors: string[];
  timestamp: string;
  ticker: string;
  amount: number; // Changed from optional to required
  price: number; // Changed from optional to required
  riskScore: number; // Changed from optional to required
  stopLoss?: number;
  takeProfit?: number;
}

export interface TradingAgent {
  id: string;
  name: string;
  description: string;
  specialization: string;
  confidence: number;
  weight: number;
  performance?: {
    accuracy: number;
    recentTrades: boolean[];
    profitFactor: number;
  };
  successRate?: number;
}

export interface AgentPerformance {
  accuracy: number;
  recentTrades: boolean[];
  profitFactor: number;
  successRate: number;
  recentSuccess?: number[];
  averageConfidence?: number;
  totalCalls?: number;
}

export interface PortfolioManagerHookReturn {
  agentRecommendations: AgentRecommendation[];
  portfolioDecision: PortfolioDecision | null;
  loadingDecision: boolean;
  riskScore: number;
  collaborationMessages: any[];
  collaborationScore: number;
  activeDiscussions: any[];
  agentPerformance: Record<string, AgentPerformance>;
  agentAccuracy: any;
  backtestResults: any[];
  tradingAgents: TradingAgent[];
  handleExecuteDecision: (isSimulationMode: boolean) => void;
  handleRefreshAnalysis: () => void;
}
