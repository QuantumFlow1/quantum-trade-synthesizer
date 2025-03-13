
import { useState, useEffect, useCallback } from 'react';
import { Agent } from '@/types/agent';
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
import { useToast } from '@/hooks/use-toast';

export const useAgentNetwork = () => {
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [sessions, setSessions] = useState<CollaborationSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize the agent network
  const initialize = useCallback(async () => {
    if (initialized || isInitializing) return true;
    
    try {
      setIsInitializing(true);
      const success = await initializeAgentNetwork();
      
      if (success) {
        setInitialized(true);
        toast({
          title: "Agent Network Initialized",
          description: "Successfully connected to the agent network"
        });
      } else {
        toast({
          title: "Initialization Failed",
          description: "Could not initialize the agent network",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error initializing agent network:', error);
      toast({
        title: "Initialization Error",
        description: "An unexpected error occurred while initializing the network",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsInitializing(false);
    }
  }, [initialized, isInitializing, toast]);
  
  // Load agents on component mount
  useEffect(() => {
    initialize().then(success => {
      if (success) {
        loadAgents();
      }
    });
  }, [initialize]);
  
  // Load agents
  const loadAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      const activeAgents = await getActiveAgents();
      setAgents(activeAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Toggle agent status
  const changeAgentStatus = useCallback(async (
    agentId: string, 
    status: 'active' | 'offline' | 'paused' | 'terminated'
  ) => {
    try {
      const success = await toggleAgentStatus(agentId, status);
      
      if (success) {
        loadAgents();
        toast({
          title: "Agent Status Updated",
          description: `Agent status changed to ${status}`,
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update agent status",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error changing agent status:', error);
      toast({
        title: "Status Change Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  }, [loadAgents, toast]);
  
  // Generate collaborative analysis
  const runCollaborativeAnalysis = useCallback(async (
    ticker: string,
    timeframe: string = '1d'
  ) => {
    try {
      toast({
        title: "Analysis Started",
        description: `Running collaborative analysis for ${ticker}...`
      });
      
      const analysis = await generateCollaborativeTradingAnalysis(ticker, timeframe);
      
      toast({
        title: "Analysis Complete",
        description: `Analysis for ${ticker} is ready`
      });
      
      return analysis;
    } catch (error) {
      console.error('Error generating collaborative analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not complete the collaborative analysis",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);
  
  return {
    initialized,
    isInitializing,
    isLoading,
    agents,
    messages,
    tasks,
    sessions,
    initialize,
    loadAgents,
    changeAgentStatus,
    runCollaborativeAnalysis
  };
};
