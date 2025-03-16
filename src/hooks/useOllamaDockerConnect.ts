
import { useState, useEffect } from "react";
import { ollamaApi, testOllamaConnection } from "@/utils/ollamaApiClient";
import { toast } from "@/components/ui/use-toast";

export interface ConnectionStatus {
  connected: boolean;
  error?: string;
  modelsCount?: number;
}

export function useOllamaDockerConnect() {
  const [dockerAddress, setDockerAddress] = useState<string>(
    localStorage.getItem('ollamaDockerAddress') || 'http://localhost:11434'
  );
  const [customAddress, setCustomAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);

  useEffect(() => {
    // Check if there's a connection status in localStorage
    const savedConnection = localStorage.getItem('ollamaConnectionStatus');
    if (savedConnection) {
      try {
        const parsedStatus = JSON.parse(savedConnection);
        setConnectionStatus(parsedStatus);
      } catch (e) {
        console.error('Error parsing saved connection status:', e);
      }
    }
  }, []);

  const connectToDocker = async (address: string) => {
    setIsConnecting(true);
    setConnectionStatus(null);
    
    try {
      console.log(`Attempting to connect to Ollama at: ${address}`);
      
      // Update the address in the API client (this method handles normalization)
      ollamaApi.setBaseUrl(address);
      
      // Get the normalized URL for displaying to the user
      const formattedAddress = ollamaApi.getBaseUrl();
      console.log(`Formatted address: ${formattedAddress}`);
      
      // Test the connection
      const result = await testOllamaConnection();
      console.log('Connection test result:', result);
      
      if (result.success) {
        // Save to localStorage if successful
        localStorage.setItem('ollamaHost', formattedAddress);
        localStorage.setItem('ollamaDockerAddress', formattedAddress);
        
        const newStatus = {
          connected: true,
          modelsCount: result.models?.length || 0
        };
        
        setConnectionStatus(newStatus);
        localStorage.setItem('ollamaConnectionStatus', JSON.stringify(newStatus));
        
        toast({
          title: "Connected to Ollama Docker",
          description: `Successfully connected to ${formattedAddress}`,
          variant: "default",
        });
      } else {
        const newStatus = {
          connected: false,
          error: result.message
        };
        
        setConnectionStatus(newStatus);
        localStorage.setItem('ollamaConnectionStatus', JSON.stringify(newStatus));
        
        toast({
          title: "Connection Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Docker connection error:', errorMessage);
      
      const newStatus = {
        connected: false,
        error: errorMessage
      };
      
      setConnectionStatus(newStatus);
      localStorage.setItem('ollamaConnectionStatus', JSON.stringify(newStatus));
      
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    dockerAddress,
    setDockerAddress,
    customAddress,
    setCustomAddress,
    isConnecting,
    connectionStatus,
    connectToDocker
  };
}
