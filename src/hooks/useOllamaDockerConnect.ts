
import { useState, useEffect, useCallback } from "react";
import { ollamaApi, testOllamaConnection } from "@/utils/ollamaApiClient";
import { toast } from "@/components/ui/use-toast";
import { ConnectionStatus, UseOllamaDockerConnectReturn } from "./ollama/types";
import { isLocalhostEnvironment, getCurrentOrigin } from "./ollama/connectionUtils";
import { handleConnectionFailure, getInitialConnectionAddress } from "./ollama/connectionStrategy";
import { useConnectionPersistence } from "./ollama/useConnectionPersistence";

// Global connection status to maintain across component unmounts
let globalConnectionStatus: ConnectionStatus | null = null;

// Using 'export type' syntax explicitly for type re-export
export type { ConnectionStatus } from "./ollama/types";

export function useOllamaDockerConnect(): UseOllamaDockerConnectReturn {
  const [dockerAddress, setDockerAddress] = useState<string>(
    localStorage.getItem('ollamaDockerAddress') || 'http://localhost:11434'
  );
  const [customAddress, setCustomAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [alternativePortsAttempted, setAlternativePortsAttempted] = useState(false);
  const [useServerSideProxy, setUseServerSideProxy] = useState(false);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  const [lastConnected, setLastConnected] = useState<number | null>(
    parseInt(localStorage.getItem('ollamaLastConnected') || '0') || null
  );
  const [corsErrorShown, setCorsErrorShown] = useState(false);
  
  // Get saved connection status
  const { connectionStatus, updateConnectionStatus } = useConnectionPersistence();
  
  // Initialize connectionStatus from global value if available
  useEffect(() => {
    if (globalConnectionStatus && !connectionStatus) {
      updateConnectionStatus(globalConnectionStatus);
    }
  }, []);
  
  // Update global connection status when local one changes
  useEffect(() => {
    if (connectionStatus) {
      globalConnectionStatus = connectionStatus;
    }
  }, [connectionStatus]);

  // Environment flags
  const isLocalhost = true; // Force local mode
  const currentOrigin = getCurrentOrigin();
  
  // Connection auto-retry strategy - start with local connections only
  useEffect(() => {
    // Only proceed if auto retry is enabled and we don't have an active connection
    if (!autoRetryEnabled || connectionStatus?.connected) {
      return;
    }

    // Only try automatically if we haven't already attempted a connection
    if (connectionAttempts === 0) {
      console.log("Starting automatic connection sequence to local Ollama only");
      connectToDocker(getInitialConnectionAddress());
      setConnectionAttempts(prev => prev + 1);
    }
  }, [autoRetryEnabled, connectionAttempts, connectionStatus?.connected]);

  const connectToDocker = async (address: string): Promise<boolean | void> => {
    // Skip non-local connections (except for Docker-specific addresses)
    if (!address.includes('localhost') && 
        !address.includes('127.0.0.1') && 
        !address.includes('host.docker.internal') &&
        !address.includes('ollama:11434')) {
      console.log(`Skipping non-local connection attempt to: ${address}`);
      toast({
        title: "Connection restricted",
        description: "Only local Ollama connections are allowed",
        variant: "destructive",
      });
      return false;
    }
    
    setIsConnecting(true);
    
    try {
      console.log(`Attempting to connect to local Ollama at: ${address}`);
      
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
        localStorage.setItem('ollamaLastConnected', Date.now().toString());
        setLastConnected(Date.now());
        
        const newStatus = {
          connected: true,
          modelsCount: result.models?.length || 0
        };
        
        updateConnectionStatus(newStatus);
        globalConnectionStatus = newStatus;
        
        // Reset attempts counter on successful connection
        setConnectionAttempts(0);
        setAlternativePortsAttempted(false);
        setCorsErrorShown(false);
        
        // Only show the toast if we're explicitly connecting (not auto-reconnecting)
        if (isConnecting) {
          toast({
            title: "Connected to Ollama",
            description: `Successfully connected to ${formattedAddress}`,
            variant: "default",
          });
        }
        
        return true;
      } else {
        const newStatus = {
          connected: false,
          error: result.message
        };
        
        updateConnectionStatus(newStatus);
        globalConnectionStatus = newStatus;
        
        // Only show toast for CORS errors if we haven't already shown one
        const isCorsError = result.message.includes('CORS');
        if (isCorsError && !corsErrorShown) {
          setCorsErrorShown(true);
          // Show a more concise error message with local-specific advice
          toast({
            title: "CORS Error",
            description: "Add OLLAMA_ORIGINS=" + currentOrigin + " when starting Ollama",
            variant: "destructive",
          });
        } else if (!isCorsError) {
          // For non-CORS errors, show the toast
          await handleConnectionFailure({
            error: new Error(result.message),
            address,
            connectionAttempts,
            alternativePortsAttempted,
            autoRetryEnabled,
            connectToDocker,
            setConnectionAttempts,
            setAlternativePortsAttempted,
            suppressToast: corsErrorShown && isCorsError
          });
        }
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Docker connection error:', errorMessage);
      
      const newStatus = {
        connected: false,
        error: errorMessage
      };
      
      updateConnectionStatus(newStatus);
      globalConnectionStatus = newStatus;
      
      // Check if this is a CORS error
      const isCorsError = errorMessage.includes('CORS') || 
                          errorMessage.includes('Failed to fetch') || 
                          errorMessage.includes('cross-origin');
      
      if (isCorsError && !corsErrorShown) {
        setCorsErrorShown(true);
        toast({
          title: "Local Ollama CORS Error",
          description: "Run Ollama with: OLLAMA_ORIGINS=" + currentOrigin + " ollama serve",
          variant: "destructive",
        });
      } else if (!isCorsError) {
        await handleConnectionFailure({
          error,
          address,
          connectionAttempts,
          alternativePortsAttempted,
          autoRetryEnabled,
          connectToDocker,
          setConnectionAttempts,
          setAlternativePortsAttempted,
          suppressToast: corsErrorShown && isCorsError
        });
      }
      
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to toggle auto retry
  const toggleAutoRetry = () => {
    setAutoRetryEnabled(prev => !prev);
  };
  
  // Function to disconnect - typically called during logout
  const disconnectFromDocker = useCallback(() => {
    updateConnectionStatus({ connected: false });
    globalConnectionStatus = { connected: false };
    localStorage.removeItem('ollamaLastConnected');
    setLastConnected(null);
    setCorsErrorShown(false);
    console.log("Disconnected from Ollama");
  }, [updateConnectionStatus]);

  return {
    dockerAddress,
    setDockerAddress,
    customAddress,
    setCustomAddress,
    isConnecting,
    connectionStatus,
    connectToDocker,
    disconnectFromDocker,
    useServerSideProxy,
    setUseServerSideProxy,
    currentOrigin,
    autoRetryEnabled,
    toggleAutoRetry,
    isLocalhost
  };
}
