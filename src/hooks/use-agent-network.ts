
import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { useSupabase } from '@/hooks/use-supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  AgentDetails, 
  AgentRecommendation, 
  AgentMessage, 
  AgentTask, 
  CollaborationSession,
  PortfolioDecision,
  TradeAction,
  UseAgentNetworkReturn
} from '@/types/agent';
import { 
  fetchAgents, 
  fetchAgentMessages, 
  fetchAgentTasks, 
  fetchCollaborationSessions,
  initializeAgentNetwork,
  sendAgentMessage,
  createAgentTask,
  toggleAgentStatus,
  submitTradeRecommendation,
  executePortfolioAnalysis
} from '@/services/agentNetwork';

export function useAgentNetwork(): UseAgentNetworkReturn {
  const { user } = useUser();
  const { executeQuery } = useSupabase();
  const { toast } = useToast();

  // State management
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<AgentDetails[]>([]);
  const [activeAgents, setActiveAgents] = useState<AgentDetails[]>([]);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentDetails | null>(null);
  const [currentMarketData, setCurrentMarketData] = useState<any | null>(null);
  const [agentRecommendations, setAgentRecommendations] = useState<AgentRecommendation[]>([]);
  const [recentAgentRecommendations, setRecentAgentRecommendations] = useState<AgentRecommendation[]>([]);
  const [portfolioDecisions, setPortfolioDecisions] = useState<PortfolioDecision[]>([]);
  const [recentPortfolioDecisions, setRecentPortfolioDecisions] = useState<PortfolioDecision[]>([]);

  // Initialize the agent network
  const initializeNetwork = useCallback(async () => {
    if (isInitialized || isLoading || !user) return;
    
    setIsLoading(true);
    try {
      const initialized = await initializeAgentNetwork();
      
      if (initialized) {
        setIsInitialized(true);
        refreshAgentState();
      }
    } catch (error) {
      console.error('Failed to initialize agent network:', error);
      toast({
        title: 'Initialization Failed',
        description: 'Could not initialize the agent network',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, isLoading, user, toast]);

  // Refresh all agent state
  const refreshAgentState = useCallback(async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    try {
      // Fetch all agent-related data
      const [newAgents, newMessages, newTasks, newSessions] = await Promise.all([
        executeQuery(() => fetchAgents(), 'Failed to fetch agents'),
        executeQuery(() => fetchAgentMessages(), 'Failed to fetch messages'),
        executeQuery(() => fetchAgentTasks(), 'Failed to fetch tasks'),
        executeQuery(() => fetchCollaborationSessions(), 'Failed to fetch sessions')
      ]);
      
      if (newAgents) setAgents(newAgents);
      if (newMessages) setAgentMessages(newMessages);
      if (newTasks) setAgentTasks(newTasks);
      if (newSessions) setCollaborationSessions(newSessions);
      
      // Update active agents
      if (newAgents) {
        setActiveAgents(newAgents.filter(agent => agent.isActive));
      }
    } catch (error) {
      console.error('Failed to refresh agent state:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoading, executeQuery]);

  // Send a message to an agent
  const sendMessage = useCallback(async (message: string, toAgent?: string) => {
    if (!user || !message.trim()) return;
    
    try {
      const targetAgent = toAgent || (selectedAgent ? selectedAgent.id : null);
      
      if (!targetAgent) {
        toast({
          title: 'Message Error',
          description: 'No target agent selected',
          variant: 'destructive',
        });
        return;
      }
      
      const sent = await sendAgentMessage(message, targetAgent);
      
      if (sent) {
        toast({
          title: 'Message Sent',
          description: `Message sent to agent successfully`,
        });
        
        // Refresh messages
        syncMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Message Failed',
        description: 'Could not send message to agent',
        variant: 'destructive',
      });
    }
  }, [user, selectedAgent, toast, syncMessages]);

  // Create a task for an agent
  const createTask = useCallback(async (description: string, assignedTo: string) => {
    if (!user || !description.trim() || !assignedTo) return;
    
    try {
      const created = await createAgentTask(description, assignedTo);
      
      if (created) {
        toast({
          title: 'Task Created',
          description: 'New task assigned to agent',
        });
        
        // Refresh tasks
        const newTasks = await executeQuery(() => fetchAgentTasks(), 'Failed to fetch tasks');
        if (newTasks) setAgentTasks(newTasks);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({
        title: 'Task Creation Failed',
        description: 'Could not create task for agent',
        variant: 'destructive',
      });
    }
  }, [user, executeQuery, toast]);

  // Toggle agent active status
  const toggleAgent = useCallback(async (id: string) => {
    if (!user || !id) return;
    
    try {
      const updated = await toggleAgentStatus(id);
      
      if (updated) {
        // Refresh agents
        const newAgents = await executeQuery(() => fetchAgents(), 'Failed to fetch agents');
        if (newAgents) {
          setAgents(newAgents);
          setActiveAgents(newAgents.filter(agent => agent.isActive));
        }
      }
    } catch (error) {
      console.error('Failed to toggle agent status:', error);
    }
  }, [user, executeQuery]);

  // Sync agent messages
  const syncMessages = useCallback(async () => {
    if (!user) return;
    
    try {
      const newMessages = await executeQuery(() => fetchAgentMessages(), 'Failed to fetch messages');
      if (newMessages) setAgentMessages(newMessages);
    } catch (error) {
      console.error('Failed to sync messages:', error);
    }
  }, [user, executeQuery]);

  // Generate analysis for a specific ticker
  const generateAnalysis = useCallback(async (ticker: string, timeframe: string) => {
    if (!user || !ticker) return;
    
    setIsLoading(true);
    try {
      const result = await executePortfolioAnalysis(ticker, timeframe);
      
      if (result) {
        // Update recommendations and portfolio decisions
        setAgentRecommendations(result.recommendations || []);
        setRecentAgentRecommendations(result.recentRecommendations || []);
        setPortfolioDecisions(result.portfolioDecisions || []);
        setRecentPortfolioDecisions(result.recentPortfolioDecisions || []);
        
        toast({
          title: 'Analysis Complete',
          description: `${ticker} analysis for ${timeframe} completed successfully`,
        });
      }
    } catch (error) {
      console.error('Failed to generate analysis:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not generate market analysis',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, executeQuery, toast]);

  // Submit a trading recommendation
  const submitRecommendation = useCallback(async (ticker: string, action: TradeAction, confidence: number) => {
    if (!user || !ticker || !action) return null;
    
    try {
      const result = await submitTradeRecommendation(ticker, action, confidence);
      
      if (result) {
        toast({
          title: 'Recommendation Submitted',
          description: `${action} recommendation for ${ticker} submitted successfully`,
        });
        
        return result;
      }
    } catch (error) {
      console.error('Failed to submit recommendation:', error);
      toast({
        title: 'Recommendation Failed',
        description: 'Could not submit trading recommendation',
        variant: 'destructive',
      });
    }
    
    return null;
  }, [user, toast]);

  // Update agent state periodically
  useEffect(() => {
    if (!isInitialized || !user) return;
    
    const interval = setInterval(() => {
      refreshAgentState();
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [isInitialized, user, refreshAgentState]);

  return {
    agents,
    activeAgents,
    agentMessages,
    agentTasks,
    collaborationSessions,
    selectedAgent,
    setSelectedAgent,
    currentMarketData,
    setCurrentMarketData,
    initializeNetwork,
    generateAnalysis,
    toggleAgent,
    sendMessage,
    createTask,
    syncMessages,
    submitRecommendation,
    agentRecommendations,
    recentAgentRecommendations,
    portfolioDecisions,
    recentPortfolioDecisions,
    isInitialized,
    isLoading,
    refreshAgentState
  };
}
