
import { useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { UseAgentNetworkReturn } from '@/types/agent';
import { useAgentInitialization } from './use-agent-initialization';
import { useAgentState } from './use-agent-state';
import { useAgentMessaging } from './use-agent-messaging';
import { useAgentTasks } from './use-agent-tasks';
import { useMarketAnalysis } from './use-market-analysis';

export function useAgentNetwork(): UseAgentNetworkReturn {
  const { user } = useUser();

  // Initialize the agent state hook first to get the refreshAgentState function
  const {
    agents,
    activeAgents,
    agentMessages,
    agentTasks,
    collaborationSessions,
    selectedAgent,
    setSelectedAgent,
    refreshAgentState,
    setAgentMessages
  } = useAgentState(user, isLoading, setIsLoading);

  // Now we can initialize the hook that depends on refreshAgentState
  const { 
    isInitialized, 
    isLoading, 
    initializeNetwork, 
    setIsLoading 
  } = useAgentInitialization(user, refreshAgentState);

  // Initialize other hooks with properly scoped variables
  const {
    sendMessage,
    syncMessages
  } = useAgentMessaging(user, selectedAgent, setAgentMessages);

  const {
    createTask,
    toggleAgent
  } = useAgentTasks(user, setAgentTasks);

  const {
    currentMarketData,
    setCurrentMarketData,
    agentRecommendations,
    recentAgentRecommendations,
    portfolioDecisions,
    recentPortfolioDecisions,
    generateAnalysis,
    submitRecommendation
  } = useMarketAnalysis(user);

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
