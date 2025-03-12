
import { useUser } from '@/hooks/use-user';
import { UseAgentNetworkReturn } from '@/types/agent';
import { useAgentInitialization } from './use-agent-initialization';
import { useAgentState } from './use-agent-state';
import { useAgentMessaging } from './use-agent-messaging';
import { useAgentTasks } from './use-agent-tasks';
import { useMarketAnalysis } from './use-market-analysis';

/**
 * Master hook that combines all agent network functionality
 */
export function useAgentNetwork(): UseAgentNetworkReturn {
  const { user } = useUser();

  // Initialize loading state outside other hooks
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the agent state hook first to get the refreshAgentState function
  const {
    agents,
    activeAgents,
    agentTasks,
    setAgentTasks,  // Make sure this is exported from useAgentState
    agentMessages,
    selectedAgent,
    setSelectedAgent,
    refreshAgentState,
    setAgentMessages
  } = useAgentState(user, isLoading, setIsLoading);

  // Now we can initialize the hook that depends on refreshAgentState
  const { 
    isInitialized, 
    initializeNetwork
  } = useAgentInitialization(user, refreshAgentState);

  // Initialize other hooks with properly scoped variables
  const {
    sendMessage,
    syncMessages
  } = useAgentMessaging(user, agents, agentMessages, setAgentMessages);

  const {
    assignTask,
    completeTask,
    taskStatus
  } = useAgentTasks(user, agents, agentTasks, setAgentTasks);

  const {
    performMarketAnalysis
  } = useMarketAnalysis(user, agents, sendMessage);

  // Return all needed functions and state
  return {
    isInitialized,
    isLoading,
    agents,
    activeAgents,
    selectedAgent,
    setSelectedAgent,
    agentMessages,
    agentTasks,
    initializeNetwork,
    refreshAgentState,
    sendMessage,
    syncMessages,
    assignTask,
    completeTask,
    taskStatus,
    performMarketAnalysis
  };
}

// Need to import useState at the top
import { useState } from 'react';
