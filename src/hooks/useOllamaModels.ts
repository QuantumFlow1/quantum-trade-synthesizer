
import { useState, useEffect, useCallback } from 'react';
import { OllamaModel, ollamaApi, testOllamaConnection } from '@/utils/ollamaApiClient';
import { toast } from '@/components/ui/use-toast';

export function useOllamaModels() {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [ollamaHost, setOllamaHost] = useState<string>(
    localStorage.getItem('ollamaHost') || 'http://localhost:11434'
  );

  // Function to refresh the connection and model list
  const refreshModels = useCallback(async () => {
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      // Update the host if it's changed
      ollamaApi.setHost(ollamaHost);
      
      // Test the connection
      const connectionTest = await testOllamaConnection();
      setIsConnected(connectionTest.success);
      
      if (!connectionTest.success) {
        setConnectionError(connectionTest.message);
        setModels([]);
        toast({
          title: "Ollama Connection Failed",
          description: connectionTest.message,
          variant: "destructive",
        });
        return;
      }
      
      // If connected, get the list of models
      const modelList = await ollamaApi.listModels();
      setModels(modelList);
      
      // Save the host to localStorage
      localStorage.setItem('ollamaHost', ollamaHost);
      
      toast({
        title: "Ollama Connected",
        description: `Found ${modelList.length} models`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error refreshing Ollama models:', error);
      setConnectionError(error instanceof Error ? error.message : 'Unknown error connecting to Ollama');
      setModels([]);
      
      toast({
        title: "Ollama Error",
        description: error instanceof Error ? error.message : 'Unknown error connecting to Ollama',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [ollamaHost]);

  // Try to connect on initial load
  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  // Update the host
  const updateHost = useCallback((newHost: string) => {
    setOllamaHost(newHost);
  }, []);

  return {
    models,
    isLoading,
    isConnected,
    connectionError,
    ollamaHost,
    updateHost,
    refreshModels,
  };
}
