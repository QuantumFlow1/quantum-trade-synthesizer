
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
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [alternativePortsAttempted, setAlternativePortsAttempted] = useState(false);
  const [useServerSideProxy, setUseServerSideProxy] = useState(false);
  // Flag to control automatic connection attempts - OFF by default
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(false);
  
  // Get current origin for CORS suggestions
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const isGitpod = typeof window !== 'undefined' && 
    (window.location.hostname.includes('gitpod.io') || 
     window.location.hostname.includes('lovableproject.com'));
  
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

  // Connection auto-retry strategy - now with a guard
  useEffect(() => {
    // Only proceed if auto retry is enabled
    if (!autoRetryEnabled) {
      console.log("Automatic connection retry is disabled");
      return;
    }

    // Only try automatically if we haven't already attempted a connection
    if (connectionAttempts === 0) {
      console.log("Starting automatic connection sequence");
      
      // Try container ID first since that's most likely to work in Docker environments
      const containerId = 'de67d12500e8'; // The container ID from your Docker
      console.log(`Automatically trying to connect to container ID: ${containerId}`);
      connectToDocker(`http://${containerId}:11434`);
      setConnectionAttempts(prev => prev + 1);
    }
  }, [connectionAttempts, autoRetryEnabled]);

  const connectToDocker = async (address: string) => {
    setIsConnecting(true);
    setConnectionStatus(null);
    
    try {
      console.log(`Attempting to connect to Ollama at: ${address}`);
      
      // Update the address in the API client
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
        
        // Reset attempts counter on successful connection
        setConnectionAttempts(0);
        setAlternativePortsAttempted(false);
        
        toast({
          title: "Verbonden met Ollama Docker",
          description: `Succesvol verbonden met ${formattedAddress}`,
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
          title: "Verbinding mislukt",
          description: result.message,
          variant: "destructive",
        });

        // Auto-retry strategy - disabled if autoRetryEnabled is false
        if (!autoRetryEnabled) {
          console.log("Auto-retry is disabled, skipping automatic retry attempts");
          return;
        }
        
        // If this was a CORS error, automatically try the container name
        if (result.message?.includes('CORS') && connectionAttempts <= 1) {
          console.log('CORS error detected, trying container name as fallback...');
          setTimeout(() => {
            connectToDocker('http://ollama:11434');
          }, 1000);
          setConnectionAttempts(prev => prev + 1);
        } 
        // If we've tried multiple attempts but still no connection, try alternative ports
        else if (connectionAttempts > 1 && !alternativePortsAttempted) {
          console.log('Multiple connection attempts failed, trying alternative ports...');
          setTimeout(() => {
            connectToDocker('http://localhost:11435');
          }, 1000);
          setAlternativePortsAttempted(true);
        }
        // If we already tried the first alternative port, try the second one
        else if (alternativePortsAttempted && address.includes('11435')) {
          console.log('Port 11435 failed, trying port 37321...');
          setTimeout(() => {
            connectToDocker('http://localhost:37321');
          }, 1000);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';
      console.error('Docker connection error:', errorMessage);
      
      const newStatus = {
        connected: false,
        error: errorMessage
      };
      
      setConnectionStatus(newStatus);
      localStorage.setItem('ollamaConnectionStatus', JSON.stringify(newStatus));
      
      toast({
        title: "Verbindingsfout",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to toggle auto retry
  const toggleAutoRetry = () => {
    setAutoRetryEnabled(prev => !prev);
  };

  return {
    dockerAddress,
    setDockerAddress,
    customAddress,
    setCustomAddress,
    isConnecting,
    connectionStatus,
    connectToDocker,
    useServerSideProxy,
    setUseServerSideProxy,
    currentOrigin,
    autoRetryEnabled,
    toggleAutoRetry
  };
}
