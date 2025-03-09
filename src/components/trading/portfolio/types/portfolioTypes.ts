
export interface AgentRecommendation {
  agentId: string;
  action: "BUY" | "SELL" | "HOLD";
  ticker: string;
  confidence: number;
  reasoning: string;
  timestamp: string;
}

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

export interface PortfolioManagerHookReturn {
  agentRecommendations: AgentRecommendation[];
  portfolioDecision: PortfolioDecision | null;
  loadingDecision: boolean;
  riskScore: number;
  collaborationMessages: any[];
  collaborationScore: number;
  activeDiscussions: any[];
  agentPerformance: any;
  agentAccuracy: any;
  backtestResults: any[];
  tradingAgents: any[];
  handleExecuteDecision: (isSimulationMode: boolean) => void;
  handleRefreshAnalysis: () => void;
  realMarketData?: any[];
  hasRealMarketData?: boolean;
}
