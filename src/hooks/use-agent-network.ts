
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
import { useAgentConnection } from './use-agent-connection';
import { logApiCall } from '@/utils/apiLogger';

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
  
  // Use the connection service instead of managing connection directly
  const { isConnected } = useAgentConnection();

  // Initialize the agent network
  useEffect(() => {
    const initialize = async () => {
      if (!isConnected) return;
      
      setIsLoading(true);
      try {
        await logApiCall('agent-network', 'useAgentNetwork.initialize', 'pending');
        const success = await initializeAgentNetwork();
        setIsInitialized(success);
        
        if (success) {
          refreshAgentState();
          await logApiCall('agent-network', 'useAgentNetwork.initialize', 'success');
        } else {
          await logApiCall('agent-network', 'useAgentNetwork.initialize', 'error', 'Failed to initialize agent network');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await logApiCall('agent-network', 'useAgentNetwork.initialize', 'error', errorMessage);
        console.error('Error initializing agent network:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isConnected && !isInitialized && !isLoading) {
      initialize();
    }
  }, [isConnected, isInitialized, isLoading]);
  
  // Sync agent state from coordinator
  const syncAgentState = useCallback(async () => {
    if (!isInitialized || !isConnected) return;
    
    try {
      await logApiCall('agent-network', 'useAgentNetwork.syncAgentState', 'pending');
      const success = await syncAgentMessages();
      
      if (success) {
        setAgentMessages(getAgentMessages());
        const sessions = await getCollaborationSessions();
        setCollaborationSessions(sessions);
        await logApiCall('agent-network', 'useAgentNetwork.syncAgentState', 'success');
      } else {
        await logApiCall('agent-network', 'useAgentNetwork.syncAgentState', 'error', 'Failed to sync agent messages');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await logApiCall('agent-network', 'useAgentNetwork.syncAgentState', 'error', errorMessage);
      console.error('Error syncing agent state:', error);
    }
  }, [isInitialized, isConnected]);
  
  // Refresh agent state from service
  const refreshAgentState = useCallback(() => {
    if (!isInitialized || !isConnected) return;
    
    setActiveAgents(getActiveAgents());
    setAgentMessages(getAgentMessages());
    setAgentTasks(getAgentTasks());
    setRecommendations(getAgentRecommendations());
    setPortfolioDecisions(getPortfolioDecisions());
    
    // Sync with coordinator
    syncAgentState();
  }, [syncAgentState, isInitialized, isConnected]);
  
  // Generate collaborative trading analysis
  const generateAnalysis = useCallback(async (
    marketData: any,
    primaryModelId: ModelId = 'grok3'
  ) => {
    if (!isConnected) {
      console.error('Cannot generate analysis: Agent network is not connected');
      return null;
    }
    
    setIsLoading(true);
    
    try {
      await logApiCall('agent-network', 'useAgentNetwork.generateAnalysis', 'pending');
      const analysis = await generateCollaborativeTradingAnalysis(marketData, primaryModelId);
      setLastAnalysis(analysis);
      refreshAgentState();
      await logApiCall('agent-network', 'useAgentNetwork.generateAnalysis', 'success');
      return analysis;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await logApiCall('agent-network', 'useAgentNetwork.generateAnalysis', 'error', errorMessage);
      console.error('Error generating analysis:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refreshAgentState, isConnected]);
  
  // Additional methods with network connection checking
  
  // Send a message between agents
  const sendMessage = useCallback(async (
    fromAgentId: string,
    toAgentId: string,
    content: string
  ) => {
    if (!isConnected) return false;
    
    try {
      await logApiCall('agent-network', 'useAgentNetwork.sendMessage', 'pending');
      const message = await sendAgentMessage(fromAgentId, toAgentId, content);
      
      if (message) {
        refreshAgentState();
        await logApiCall('agent-network', 'useAgentNetwork.sendMessage', 'success');
        return true;
      }
      
      await logApiCall('agent-network', 'useAgentNetwork.sendMessage', 'error', 'No message returned');
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await logApiCall('agent-network', 'useAgentNetwork.sendMessage', 'error', errorMessage);
      console.error('Error sending message:', error);
      return false;
    }
  }, [refreshAgentState, isConnected]);
  
  // Create a task for an agent
  const createTask = useCallback(async (
    agentId: string,
    description: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    if (!isConnected) return null;
    
    try {
      await logApiCall('agent-network', 'useAgentNetwork.createTask', 'pending');
      const task = await createAgentTask(agentId, description, priority);
      
      if (task) {
        refreshAgentState();
        await logApiCall('agent-network', 'useAgentNetwork.createTask', 'success');
        return task;
      }
      
      await logApiCall('agent-network', 'useAgentNetwork.createTask', 'error', 'No task returned');
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await logApiCall('agent-network', 'useAgentNetwork.createTask', 'error', errorMessage);
      console.error('Error creating task:', error);
      return null;
    }
  }, [refreshAgentState, isConnected]);
  
  // Toggle agent active status
  const toggleAgent = useCallback((agentId: string, isActive: boolean) => {
    if (!isConnected) return false;
    
    try {
      const success = toggleAgentStatus(agentId, isActive);
      
      if (success) {
        refreshAgentState();
      }
      
      return success;
    } catch (error) {
      console.error('Error toggling agent status:', error);
      return false;
    }
  }, [refreshAgentState, isConnected]);

  // Submit a recommendation from an agent
  const submitRecommendation = useCallback(async (
    agentId: string,
    action: TradeAction,
    confidence: number,
    reasoning: string,
    ticker?: string,
    price?: number
  ) => {
    if (!isConnected) return null;
    
    try {
      await logApiCall('agent-network', 'useAgentNetwork.submitRecommendation', 'pending');
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
        await logApiCall('agent-network', 'useAgentNetwork.submitRecommendation', 'success');
        return recommendation;
      }
      
      await logApiCall('agent-network', 'useAgentNetwork.submitRecommendation', 'error', 'No recommendation returned');
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await logApiCall('agent-network', 'useAgentNetwork.submitRecommendation', 'error', errorMessage);
      console.error('Error submitting recommendation:', error);
      return null;
    }
  }, [refreshAgentState, isConnected]);

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
    if (!isConnected) return null;
    
    try {
      await logApiCall('agent-network', 'useAgentNetwork.makePortfolioDecision', 'pending');
      const decision = await createPortfolioDecision(
        action,
        ticker,
        amount,
        price,
        options
      );
      
      if (decision) {
        refreshAgentState();
        await logApiCall('agent-network', 'useAgentNetwork.makePortfolioDecision', 'success');
        return decision;
      }
      
      await logApiCall('agent-network', 'useAgentNetwork.makePortfolioDecision', 'error', 'No decision returned');
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await logApiCall('agent-network', 'useAgentNetwork.makePortfolioDecision', 'error', errorMessage);
      console.error('Error creating portfolio decision:', error);
      return null;
    }
  }, [refreshAgentState, isConnected]);

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
    isConnected,
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
