
import { useState, useEffect, useCallback } from 'react';
import { 
  initializeAgentNetwork, 
  generateCollaborativeTradingAnalysis,
  getActiveAgents,
  getAgentMessages,
  getAgentTasks,
  toggleAgentStatus,
  AgentMessage,
  AgentTask
} from '@/services/agentNetwork';
import { Agent } from '@/types/agent';
import { ModelId } from '@/components/chat/types/GrokSettings';

export function useAgentNetwork() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<string | null>(null);

  // Initialize the agent network
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const success = await initializeAgentNetwork();
      setIsInitialized(success);
      
      if (success) {
        refreshAgentState();
      }
      
      setIsLoading(false);
    };
    
    initialize();
  }, []);
  
  // Refresh agent state from service
  const refreshAgentState = useCallback(() => {
    setActiveAgents(getActiveAgents());
    setAgentMessages(getAgentMessages());
    setAgentTasks(getAgentTasks());
  }, []);
  
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
  
  // Toggle agent active status
  const toggleAgent = useCallback((agentId: string, isActive: boolean) => {
    const success = toggleAgentStatus(agentId, isActive);
    if (success) {
      refreshAgentState();
    }
    return success;
  }, [refreshAgentState]);

  return {
    isInitialized,
    isLoading,
    activeAgents,
    agentMessages,
    agentTasks,
    lastAnalysis,
    generateAnalysis,
    toggleAgent,
    refreshAgentState
  };
}
