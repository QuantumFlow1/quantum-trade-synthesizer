
import { useCallback, useState } from 'react';
import { useAgentState } from './use-agent-state';
import { useAgentInitialization } from './use-agent-initialization';
import { useAgentMessaging } from './use-agent-messaging';
import { useAgentTasks } from './use-agent-tasks';
import { useMarketAnalysis } from './use-market-analysis';
import { UseAgentNetworkReturn } from './types';

export const useAgentNetwork = (): UseAgentNetworkReturn => {
  // Create a user object placeholder for hooks that need it
  const [user] = useState({ id: 'current-user' });
  
  // Create isLoading state that can be shared across hooks
  const [isLoading, setIsLoading] = useState(false);
  
  // Use hooks for different functionalities with proper parameters
  const { 
    agents, 
    activeAgents, 
    agentMessages,
    agentTasks,
    collaborationSessions,
    selectedAgent,
    setSelectedAgent,
    refreshAgentState,
    setAgentMessages,
    setAgentTasks,
    setAgents 
  } = useAgentState(user, isLoading, setIsLoading);
  
  const { 
    isInitialized,
    initializeNetwork
  } = useAgentInitialization(user, refreshAgentState);
  
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

  // Return the combined API
  return {
    // Agent state
    agents,
    activeAgents,
    agentMessages,
    agentTasks,
    collaborationSessions,
    selectedAgent,
    setSelectedAgent,
    
    // Initialization
    isInitialized,
    isLoading,
    initializeNetwork,
    refreshAgentState,
    
    // Messaging
    sendMessage,
    syncMessages,
    
    // Tasks
    createTask,
    toggleAgent,
    
    // Analysis
    currentMarketData,
    setCurrentMarketData,
    agentRecommendations,
    recentAgentRecommendations,
    portfolioDecisions,
    recentPortfolioDecisions,
    generateAnalysis,
    submitRecommendation
  };
};
