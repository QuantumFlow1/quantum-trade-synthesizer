
import { useState, useEffect, useCallback } from 'react';
import { OllamaModel } from '@/components/llm-extensions/ollama/types/ollamaTypes';
import { ollamaApi, testOllamaConnection } from '@/utils/ollamaApiClient';
import { toast } from '@/components/ui/use-toast';

export function useOllamaModels() {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [ollamaHost, setOllamaHost] = useState<string>(
    localStorage.getItem('ollamaHost') || 'http://localhost:11434'
  );
  const [hasNotifiedOnInitialConnection, setHasNotifiedOnInitialConnection] = useState(false);

  // Function to refresh the connection and model list
  const refreshModels = useCallback(async () => {
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      // Update the host if it's changed
      ollamaApi.setBaseUrl(ollamaHost);
      
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
      console.log('Fetching Ollama models...');
      const modelList = await ollamaApi.listModels();
      console.log('Ollama models fetched:', modelList);
      setModels(modelList);
      
      // Save the host to localStorage
      localStorage.setItem('ollamaHost', ollamaHost);
      
      // Show notification on initial successful connection with models
      if (modelList.length > 0 && !hasNotifiedOnInitialConnection) {
        toast({
          title: "Ollama Models Found",
          description: `Found ${modelList.length} local Ollama models. You can start chatting now!`,
          duration: 5000,
        });
        setHasNotifiedOnInitialConnection(true);
      } else if (modelList.length === 0 && connectionTest.success) {
        toast({
          title: "Ollama Connected",
          description: "Connected to Ollama, but no models found. Install models to start chatting.",
          duration: 5000,
        });
      }
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
  }, [ollamaHost, hasNotifiedOnInitialConnection]);

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
    error: connectionError, // Include error for backward compatibility
  };
}
