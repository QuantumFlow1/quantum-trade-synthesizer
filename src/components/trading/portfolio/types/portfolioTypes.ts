
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
}
