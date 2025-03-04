
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import agentConnectionService, { AgentConnectionStatus } from '@/services/agentConnectionService';

/**
 * Hook to interact with the agent connection service
 */
export function useAgentConnection() {
  const [status, setStatus] = useState<AgentConnectionStatus>(agentConnectionService.getStatus());
  
  // Subscribe to status changes
  useEffect(() => {
    const unsubscribe = agentConnectionService.subscribe(newStatus => {
      setStatus(newStatus);
    });
    
    // Clean up on unmount
    return unsubscribe;
  }, []);
  
  // Function to manually check connection
  const checkConnection = useCallback(async (showToast: boolean = true) => {
    if (showToast) {
      toast({
        title: "Checking agent connection",
        description: "Verifying connection to trading agent network...",
      });
    }
    
    const isConnected = await agentConnectionService.checkConnection();
    
    if (showToast) {
      if (isConnected) {
        toast({
          title: "Agent network connected",
          description: `Connected to agent network with ${status.activeAgents} active agents`,
        });
      } else {
        toast({
          title: "Agent network unavailable",
          description: status.error || "Could not connect to agent network",
          variant: "destructive",
        });
      }
    }
    
    return isConnected;
  }, [status.activeAgents, status.error]);
  
  // Simulate connection for development
  const simulateConnection = useCallback((connected: boolean, activeAgents: number = connected ? 3 : 0) => {
    agentConnectionService.resetStatus({
      isConnected: connected,
      activeAgents,
      lastChecked: new Date()
    });
    
    toast({
      title: connected ? "Simulated connection active" : "Simulated connection inactive",
      description: connected 
        ? `Simulating ${activeAgents} active agents` 
        : "Agent network simulation disabled",
    });
  }, []);
  
  return {
    ...status,
    checkConnection,
    simulateConnection
  };
}
