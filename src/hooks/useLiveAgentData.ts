
import { useState, useEffect } from 'react';
import { liveAgentService } from '@/services/agentData/liveAgentService';
import { Agent, AgentRecommendation } from '@/types/agent';

export function useLiveAgentData() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [recommendations, setRecommendations] = useState<AgentRecommendation[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Connect to agent network on mount
  useEffect(() => {
    const connect = async () => {
      setIsConnecting(true);
      const success = await liveAgentService.connectToAgentNetwork();
      setIsConnected(success);
      setIsConnecting(false);
    };
    
    connect();
  }, []);
  
  // Subscribe to agent updates
  useEffect(() => {
    const handleAgentsUpdate = (updatedAgents: Agent[]) => {
      setAgents(updatedAgents);
    };
    
    const handleRecommendationsUpdate = (updatedRecommendations: AgentRecommendation[]) => {
      setRecommendations(updatedRecommendations);
    };
    
    liveAgentService.addListener(handleAgentsUpdate);
    liveAgentService.addRecommendationListener(handleRecommendationsUpdate);
    
    return () => {
      liveAgentService.removeListener(handleAgentsUpdate);
      liveAgentService.removeRecommendationListener(handleRecommendationsUpdate);
    };
  }, []);
  
  return {
    agents,
    recommendations,
    isConnected,
    isConnecting
  };
}
