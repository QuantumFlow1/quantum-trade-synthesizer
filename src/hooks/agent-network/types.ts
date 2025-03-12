
import { 
  AgentDetails, 
  AgentMessage, 
  AgentTask, 
  CollaborationSession,
  TradeAction,
  AgentRecommendation,
  PortfolioDecision
} from '@/types/agent';
import { Dispatch, SetStateAction } from 'react';

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

export interface AgentStateReturn {
  agents: AgentDetails[];
  activeAgents: AgentDetails[];
  agentMessages: AgentMessage[];
  agentTasks: AgentTask[];
  collaborationSessions: CollaborationSession[];
  selectedAgent: AgentDetails | null;
  setSelectedAgent: (agent: AgentDetails | null) => void;
  refreshAgentState: () => void;
  setAgentMessages: Dispatch<SetStateAction<AgentMessage[]>>;
  setAgentTasks: Dispatch<SetStateAction<AgentTask[]>>;
  setAgents: Dispatch<SetStateAction<AgentDetails[]>>;
}

export interface AgentInitializationReturn {
  isInitialized: boolean;
  isLoading: boolean;
  initializeNetwork: () => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export interface AgentMessagingReturn {
  sendMessage: (message: string, toAgent?: string) => void;
  syncMessages: () => void;
}

export interface AgentTasksReturn {
  createTask: (description: string, assignedTo: string) => void;
  toggleAgent: (id: string) => void;
}

export interface MarketAnalysisReturn {
  currentMarketData: any | null;
  setCurrentMarketData: Dispatch<SetStateAction<any | null>>;
  agentRecommendations: AgentRecommendation[];
  recentAgentRecommendations: AgentRecommendation[];
  portfolioDecisions: PortfolioDecision[];
  recentPortfolioDecisions: PortfolioDecision[];
  generateAnalysis: (ticker: string, timeframe: string) => void;
  submitRecommendation: (ticker: string, action: TradeAction, confidence: number) => Promise<any>;
}
