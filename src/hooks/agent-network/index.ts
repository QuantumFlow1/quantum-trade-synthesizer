
import { useCallback } from 'react';
import { useAgentState } from './use-agent-state';
import { useAgentInitialization } from './use-agent-initialization';
import { useAgentMessaging } from './use-agent-messaging';
import { useAgentTasks } from './use-agent-tasks';
import { useMarketAnalysis } from './use-market-analysis';
import { UseAgentNetworkReturn } from './types'; // Assuming types are defined here

export const useAgentNetwork = (): UseAgentNetworkReturn => {
  // Use hooks for different functionalities
  const { 
    agents, 
    agentStatus, 
    activeAgents, 
    agentMessages,
    agentTasks,
    setAgents,
    setAgentTasks,
    refreshAgentState 
  } = useAgentState();
  
  const { 
    initializeAgentNetwork, 
    resetAgentNetwork 
  } = useAgentInitialization(setAgents);
  
  const { 
    sendMessageToAgent, 
    broadcastMessage 
  } = useAgentMessaging(agents, agentMessages);
  
  const { 
    createTask,
    toggleAgent
  } = useAgentTasks(agents, setAgents, agentTasks, setAgentTasks);
  
  const {
    currentMarketData,
    setCurrentMarketData,
    agentRecommendations,
    recentAgentRecommendations,
    portfolioDecisions,
    recentPortfolioDecisions,
    generateAnalysis
  } = useMarketAnalysis();

  // Callback to refresh the state
  const refreshState = useCallback(() => {
    refreshAgentState();
  }, [refreshAgentState]);

  // Return the combined API
  return {
    // Agent state
    agents,
    agentStatus,
    activeAgents,
    agentMessages,
    agentTasks,
    
    // Initialization
    initializeAgentNetwork,
    resetAgentNetwork,
    refreshState,
    
    // Messaging
    sendMessageToAgent,
    broadcastMessage,
    
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
    generateAnalysis
  };
};

// Re-export from the folder
export { useAgentNetwork };
