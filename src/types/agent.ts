
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

export interface AgentDetails extends Omit<Agent, 'type' | 'status' | 'lastActive'> {
  id: string;
  name: string;
  description: string;
  specialization: string;
  confidence: number;
  weight: number;
  isActive: boolean;
}

export interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  message: string;
  timestamp: string;
  read: boolean;
  content?: string; // Added missing property
}

export interface AgentTask {
  id: string;
  assignedTo: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: string;
  completedAt: string | null;
  agentId?: string; // Added missing property
  priority?: 'low' | 'medium' | 'high'; // Added missing property
  result?: string; // Added missing property
}

export interface CollaborationSession {
  id: string;
  participants: string[];
  topic: string;
  startTime: string;
  endTime: string | null;
  status: 'active' | 'completed';
}

// Update UseAgentNetworkReturn interface
export interface UseAgentNetworkReturn {
  agents: AgentDetails[];
  activeAgents: AgentDetails[];
  agentMessages: AgentMessage[];
  agentTasks: AgentTask[];
  collaborationSessions: CollaborationSession[];
  selectedAgent: AgentDetails | null;
  setSelectedAgent: (agent: AgentDetails | null) => void;
  currentMarketData: any | null;
  setCurrentMarketData: (data: any | null) => void;
  initializeNetwork: () => void;
  generateAnalysis: (ticker: string, timeframe: string) => void;
  toggleAgent: (id: string) => void;
  sendMessage: (message: string, toAgent?: string) => void;
  createTask: (description: string, assignedTo: string) => void;
  syncMessages: () => void;
  submitRecommendation: (ticker: string, action: TradeAction, confidence: number) => Promise<any>;
  agentRecommendations: AgentRecommendation[];
  recentAgentRecommendations: AgentRecommendation[];
  portfolioDecisions: PortfolioDecision[];
  recentPortfolioDecisions: PortfolioDecision[];
  isInitialized: boolean;
  isLoading: boolean;
  refreshAgentState: () => void;
}
