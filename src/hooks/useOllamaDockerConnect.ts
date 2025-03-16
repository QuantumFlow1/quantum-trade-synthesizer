
import { useState, useEffect } from "react";
import { ollamaApi, testOllamaConnection } from "@/utils/ollamaApiClient";
import { toast } from "@/components/ui/use-toast";
import { ConnectionStatus, UseOllamaDockerConnectReturn } from "./ollama/types";
import { isLocalhostEnvironment, getCurrentOrigin } from "./ollama/connectionUtils";
import { handleConnectionFailure, getInitialConnectionAddress } from "./ollama/connectionStrategy";
import { useConnectionPersistence } from "./ollama/useConnectionPersistence";

export { ConnectionStatus } from "./ollama/types";

export function useOllamaDockerConnect(): UseOllamaDockerConnectReturn {
  const [dockerAddress, setDockerAddress] = useState<string>(
    localStorage.getItem('ollamaDockerAddress') || 'http://localhost:11434'
  );
  const [customAddress, setCustomAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [alternativePortsAttempted, setAlternativePortsAttempted] = useState(false);
  const [useServerSideProxy, setUseServerSideProxy] = useState(false);
  // Enable auto-retry by default for better local connections
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  
  // Get saved connection status
  const { connectionStatus, updateConnectionStatus } = useConnectionPersistence();
  
  // Environment flags
  const isLocalhost = isLocalhostEnvironment();
  const currentOrigin = getCurrentOrigin();
  
  useEffect(() => {
    // If running locally and auto-retry is enabled, try connecting automatically
    if (isLocalhost && autoRetryEnabled && connectionAttempts === 0) {
      console.log("Running locally with auto-retry enabled, attempting to connect to localhost");
      setTimeout(() => {
        connectToDocker('http://localhost:11434');
      }, 500);
    }
  }, [isLocalhost, autoRetryEnabled]);

  // Connection auto-retry strategy
  useEffect(() => {
    // Only proceed if auto retry is enabled
    if (!autoRetryEnabled) {
      console.log("Automatic connection retry is disabled");
      return;
    }

    // Only try automatically if we haven't already attempted a connection
    if (connectionAttempts === 0) {
      console.log("Starting automatic connection sequence");
      connectToDocker(getInitialConnectionAddress());
      setConnectionAttempts(prev => prev + 1);
    }
  }, [autoRetryEnabled]);

  const connectToDocker = async (address: string) => {
    setIsConnecting(true);
    updateConnectionStatus({ connected: false });
    
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
        
        updateConnectionStatus(newStatus);
        
        // Reset attempts counter on successful connection
        setConnectionAttempts(0);
        setAlternativePortsAttempted(false);
        
        toast({
          title: "Connected to Ollama",
          description: `Successfully connected to ${formattedAddress}`,
          variant: "default",
        });
      } else {
        const newStatus = {
          connected: false,
          error: result.message
        };
        
        updateConnectionStatus(newStatus);
        
        await handleConnectionFailure({
          error: new Error(result.message),
          address,
          connectionAttempts,
          alternativePortsAttempted,
          autoRetryEnabled,
          connectToDocker,
          setConnectionAttempts,
          setAlternativePortsAttempted
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Docker connection error:', errorMessage);
      
      const newStatus = {
        connected: false,
        error: errorMessage
      };
      
      updateConnectionStatus(newStatus);
      
      await handleConnectionFailure({
        error,
        address,
        connectionAttempts,
        alternativePortsAttempted,
        autoRetryEnabled,
        connectToDocker,
        setConnectionAttempts,
        setAlternativePortsAttempted
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
    toggleAutoRetry,
    isLocalhost
  };
}
