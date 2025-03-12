
export interface AgentRecommendation {
  agentId: string;
  action: "BUY" | "SELL" | "HOLD" | "SHORT" | "COVER";
  ticker: string;
  confidence: number;
  reasoning: string;
  timestamp: string;
}

export interface PortfolioDecision {
  id: string;
  action?: "BUY" | "SELL" | "HOLD" | "SHORT" | "COVER";
  finalDecision: "BUY" | "SELL" | "HOLD" | "SHORT" | "COVER";
  ticker: string;
  amount: number;
  price: number;
  confidence: number;
  riskScore: number;
  contributors: string[];
  reasoning: string;
  timestamp: string;
  recommendedActions: AgentRecommendation[];
}

export interface PortfolioManagerProps {
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
  currentData?: any;
  children?: React.ReactNode;
}

export interface TradingAgent {
  id: string;
  name: string;
  description: string;
  specialization: string;
  confidence: number;
  weight: number;
  successRate?: number;
  isActive?: boolean;
  performance?: {
    accuracy: number;
    recentTrades: boolean[];
    profitFactor: number;
  };
}

export interface AgentPerformance {
  accuracy: number;
  recentTrades: boolean[];
  profitFactor: number;
  successRate: number;
  recentSuccess: number[];
  averageConfidence: number;
  totalCalls: number;
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
  agentAccuracy: Record<string, {
    overall: number;
    recent: number;
    confidence: [number, number];
    predictionHistory?: Array<{correct: boolean, date: string, prediction: string}>;
  }>;
  backtestResults: any[];
  tradingAgents: TradingAgent[];
  handleExecuteDecision: (isSimulationMode: boolean) => void;
  handleRefreshAnalysis: () => void;
  realMarketData?: any[];
  hasRealMarketData?: boolean;
}
