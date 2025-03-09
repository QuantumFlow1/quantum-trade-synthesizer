
import { useState, useEffect } from 'react';
import { Agent } from '@/types/agent';
import { liveAgentService } from '@/services/agentData/liveAgentService';

export const useLiveAgentData = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAgents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await liveAgentService.fetchAgents();
      setAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch agents'));
      console.error('Error fetching agents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    
    // Set up an interval to refresh the data
    const intervalId = setInterval(() => {
      fetchAgents();
    }, 30000); // Refresh every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return {
    agents,
    isLoading,
    error,
    refreshAgents: fetchAgents
  };
};
