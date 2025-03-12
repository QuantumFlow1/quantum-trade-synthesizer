import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { useSupabase } from "@/hooks/use-supabase";
import { 
  AgentDetails, 
  TradeAction,
  AgentMessage as AgentMessageType,
  AgentTask as AgentTaskType,
  CollaborationSession as CollaborationSessionType
} from '@/types/agent';
import { 
  AgentMessage,
  AgentTask,
  CollaborationSession,
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
  getPortfolioDecisions,
  getRecentPortfolioDecisions
} from '@/services/agentNetwork';

interface UseAgentNetworkReturn {
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
  agentRecommendations: AgentMessageType[];
  recentAgentRecommendations: AgentMessageType[];
  portfolioDecisions: AgentTaskType[];
  recentPortfolioDecisions: AgentTaskType[];
}

export const useAgentNetwork = (): UseAgentNetworkReturn => {
  const [agents, setAgents] = useState<AgentDetails[]>([]);
  const [activeAgents, setActiveAgents] = useState<AgentDetails[]>([]);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentDetails | null>(null);
  const [currentMarketData, setCurrentMarketData] = useState<any | null>(null);
  const [agentRecommendations, setAgentRecommendations] = useState<AgentMessageType[]>([]);
  const [recentAgentRecommendations, setRecentAgentRecommendations] = useState<AgentMessageType[]>([]);
  const [portfolioDecisions, setPortfolioDecisions] = useState<AgentTaskType[]>([]);
  const [recentPortfolioDecisions, setRecentPortfolioDecisions] = useState<AgentTaskType[]>([]);
  const { toast } = useToast();
  const { user } = useUser();
  const { supabase } = useSupabase();

  useEffect(() => {
    // Fetch agents from Supabase on mount
    const fetchAgents = async () => {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('*');
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          setAgents(data as AgentDetails[]);
        }
      } catch (error: any) {
        console.error("Error fetching agents:", error);
        toast({
          title: "Error fetching agents",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    
    fetchAgents();
  }, [supabase, toast]);

  const initializeNetwork = useCallback(() => {
    initializeAgentNetwork();
    setActiveAgents(getActiveAgents());
    setAgentMessages(getAgentMessages());
    setAgentTasks(getAgentTasks());
    setCollaborationSessions(getCollaborationSessions());
    
    toast({
      title: "Agent Network Initialized",
      description: "The agent network has been successfully initialized.",
    });
  }, [toast]);

  const generateAnalysis = useCallback((ticker: string, timeframe: string) => {
    const analysis = generateCollaborativeTradingAnalysis(ticker, timeframe);
    
    toast({
      title: "Analysis Generated",
      description: `Generated collaborative trading analysis for ${ticker} in ${timeframe}.`,
    });
    
    console.log("Generated Analysis:", analysis);
  }, [toast]);

  const toggleAgent = useCallback((id: string) => {
    toggleAgentStatus(id);
    setActiveAgents(getActiveAgents());
    
    toast({
      title: "Agent Status Updated",
      description: `Agent ${id} status has been toggled.`,
    });
  }, [toast]);

  const sendMessage = useCallback((message: string, toAgent?: string) => {
    const newMessage = sendAgentMessage(message, toAgent);
    setAgentMessages(prevMessages => [...prevMessages, newMessage]);
    
    toast({
      title: "Message Sent",
      description: `Message sent to ${toAgent || 'network'}.`,
    });
  }, [toast]);

  const createTask = useCallback((description: string, assignedTo: string) => {
    const newTask = createAgentTask(description, assignedTo);
    setAgentTasks(prevTasks => [...prevTasks, newTask]);
    
    toast({
      title: "Task Created",
      description: `Task created and assigned to ${assignedTo}.`,
    });
  }, [toast]);

  const syncMessages = useCallback(() => {
    syncAgentMessages();
    
    toast({
      title: "Messages Synced",
      description: "Agent messages have been synced.",
    });
  }, [toast]);

  useEffect(() => {
    setAgentRecommendations(getAgentRecommendations());
    setRecentAgentRecommendations(getRecentAgentRecommendations());
    setPortfolioDecisions(getPortfolioDecisions());
    setRecentPortfolioDecisions(getRecentPortfolioDecisions());
  }, []);

  // Fix the function call with the correct number of arguments (line 277 issue)
  const submitRecommendation = useCallback(async (
    ticker: string, 
    action: TradeAction, 
    confidence: number
  ) => {
    if (!selectedAgent || !currentMarketData) return null;
    
    return await submitAgentRecommendation(
      selectedAgent,
      ticker,
      action
    );
  }, [selectedAgent, currentMarketData]);

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
    recentPortfolioDecisions
  };
};
