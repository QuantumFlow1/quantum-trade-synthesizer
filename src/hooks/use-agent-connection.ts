
import { useState, useCallback } from 'react';

export const useAgentConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeAgents, setActiveAgents] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async (forceCheck = false) => {
    if (isVerifying && !forceCheck) return;
    
    setIsVerifying(true);
    
    try {
      // Simulate checking connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsConnected(true);
      setActiveAgents(5); // Mock active agents count
      setError(null);
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsVerifying(false);
    }
  }, [isVerifying]);

  const simulateConnection = useCallback((connected: boolean) => {
    setIsConnected(connected);
    setActiveAgents(connected ? 5 : 0);
  }, []);

  return {
    isConnected,
    isVerifying,
    activeAgents,
    error,
    checkConnection,
    simulateConnection
  };
};
