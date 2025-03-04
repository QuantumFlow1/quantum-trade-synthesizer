
import { useState, useEffect, useCallback } from 'react';
import { 
  initializeAgentNetwork, 
  generateCollaborativeTradingAnalysis,
  getActiveAgents,
  getAgentMessages,
  getAgentTasks,
  toggleAgentStatus,
  sendAgentMessage,
  createAgentTask,
  syncAgentMessages,
  getCollaborationSessions,
  submitAgentRecommendation,
  getAgentRecommendations,
  getRecentAgentRecommendations,
  createPortfolioDecision,
  getPortfolioDecisions,
  getRecentPortfolioDecisions,
  AgentMessage,
  AgentTask,
  CollaborationSession
} from '@/services/agentNetwork';
import { Agent, AgentRecommendation, PortfolioDecision, TradeAction } from '@/types/agent';
import { ModelId } from '@/components/chat/types/GrokSettings';

export function useAgentNetwork() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([]);
  const [recommendations, setRecommendations] = useState<AgentRecommendation[]>([]);
  const [portfolioDecisions, setPortfolioDecisions] = useState<PortfolioDecision[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<string | null>(null);
  const [syncInterval, setSyncInterval] = useState<number | null>(null);

  // Initialize the agent network
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const success = await initializeAgentNetwork();
      setIsInitialized(success);
      
      if (success) {
        refreshAgentState();
        
        // Set up periodic sync if not already set
        if (!syncInterval) {
          const intervalId = window.setInterval(() => {
            syncAgentState();
          }, 30000); // Sync every 30 seconds
          setSyncInterval(intervalId);
        }
      }
      
      setIsLoading(false);
    };
    
    initialize();
    
    // Clean up interval on unmount
    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, []);
  
  // Sync agent state from coordinator
  const syncAgentState = useCallback(async () => {
    if (!isInitialized) return;
    
    const success = await syncAgentMessages();
    if (success) {
      setAgentMessages(getAgentMessages());
    }
    
    const sessions = await getCollaborationSessions();
    setCollaborationSessions(sessions);
  }, [isInitialized]);
  
  // Refresh agent state from service
  const refreshAgentState = useCallback(() => {
    setActiveAgents(getActiveAgents());
    setAgentMessages(getAgentMessages());
    setAgentTasks(getAgentTasks());
    setRecommendations(getAgentRecommendations());
    setPortfolioDecisions(getPortfolioDecisions());
    
    // Sync with coordinator
    syncAgentState();
  }, [syncAgentState]);
  
  // Generate collaborative trading analysis
  const generateAnalysis = useCallback(async (
    marketData: any,
    primaryModelId: ModelId = 'grok3'
  ) => {
    setIsLoading(true);
    
    try {
      const analysis = await generateCollaborativeTradingAnalysis(marketData, primaryModelId);
      setLastAnalysis(analysis);
      refreshAgentState();
      return analysis;
    } finally {
      setIsLoading(false);
    }
  }, [refreshAgentState]);
  
  // Send a message between agents
  const sendMessage = useCallback(async (
    fromAgentId: string,
    toAgentId: string,
    content: string
  ) => {
    const message = await sendAgentMessage(fromAgentId, toAgentId, content);
    if (message) {
      refreshAgentState();
      return true;
    }
    return false;
  }, [refreshAgentState]);
  
  // Create a task for an agent
  const createTask = useCallback(async (
    agentId: string,
    description: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    const task = await createAgentTask(agentId, description, priority);
    if (task) {
      refreshAgentState();
      return task;
    }
    return null;
  }, [refreshAgentState]);
  
  // Toggle agent active status
  const toggleAgent = useCallback((agentId: string, isActive: boolean) => {
    const success = toggleAgentStatus(agentId, isActive);
    if (success) {
      refreshAgentState();
    }
    return success;
  }, [refreshAgentState]);

  // Submit a recommendation from an agent
  const submitRecommendation = useCallback(async (
    agentId: string,
    action: TradeAction,
    confidence: number,
    reasoning: string,
    ticker?: string,
    price?: number
  ) => {
    const recommendation = await submitAgentRecommendation(
      agentId,
      action,
      confidence,
      reasoning,
      ticker,
      price
    );
    
    if (recommendation) {
      refreshAgentState();
      return recommendation;
    }
    return null;
  }, [refreshAgentState]);

  // Create a portfolio decision
  const makePortfolioDecision = useCallback(async (
    action: TradeAction,
    ticker: string,
    amount: number,
    price: number,
    options: {
      stopLoss?: number;
      takeProfit?: number;
      confidence?: number;
      riskScore?: number;
      contributors?: string[];
      reasoning?: string;
    } = {}
  ) => {
    const decision = await createPortfolioDecision(
      action,
      ticker,
      amount,
      price,
      options
    );
    
    if (decision) {
      refreshAgentState();
      return decision;
    }
    return null;
  }, [refreshAgentState]);

  return {
    isInitialized,
    isLoading,
    activeAgents,
    agentMessages,
    agentTasks,
    collaborationSessions,
    recommendations,
    portfolioDecisions,
    lastAnalysis,
    generateAnalysis,
    sendMessage,
    createTask,
    toggleAgent,
    refreshAgentState,
    syncAgentState,
    submitAgentRecommendation: submitRecommendation,
    createPortfolioDecision: makePortfolioDecision,
    getRecentAgentRecommendations,
    getRecentPortfolioDecisions
  };
}
