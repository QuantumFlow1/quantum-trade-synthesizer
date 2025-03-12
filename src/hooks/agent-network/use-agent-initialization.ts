
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initializeAgentNetwork } from '@/services/agentNetwork';

export function useAgentInitialization(user: any, refreshAgentState: () => void) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initializeNetwork = useCallback(async () => {
    if (isInitialized || isLoading || !user) return;
    
    setIsLoading(true);
    try {
      const initialized = await initializeAgentNetwork();
      
      if (initialized) {
        setIsInitialized(true);
        refreshAgentState();
      }
    } catch (error) {
      console.error('Failed to initialize agent network:', error);
      toast({
        title: 'Initialization Failed',
        description: 'Could not initialize the agent network',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, isLoading, user, refreshAgentState, toast]);

  return {
    isInitialized,
    isLoading,
    initializeNetwork,
    setIsLoading
  };
}
