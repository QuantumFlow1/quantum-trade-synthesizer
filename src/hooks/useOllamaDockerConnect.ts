
import { useState, useEffect, useCallback } from "react";
import { ollamaApi, testOllamaConnection } from "@/utils/ollamaApiClient";
import { toast } from "@/components/ui/use-toast";
import { ConnectionStatus, UseOllamaDockerConnectReturn } from "./ollama/types";
import { isLocalhostEnvironment, getCurrentOrigin } from "./ollama/connectionUtils";
import { handleConnectionFailure, getInitialConnectionAddress } from "./ollama/connectionStrategy";
import { useConnectionPersistence } from "./ollama/useConnectionPersistence";

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
  
  // Get saved connection status
  const { connectionStatus, updateConnectionStatus } = useConnectionPersistence();
  
  // Get auth state (if available)
  let auth = { isAdmin: false, user: null };
  try {
    // Safely try to use auth, but don't fail if it's not available
    const authModule = require('@/components/auth/AuthProvider');
    if (authModule && typeof authModule.useAuth === 'function') {
      try {
        auth = authModule.useAuth();
      } catch (e) {
        // Silent fail if auth context is not available
        console.log('Auth context not available, using default values');
      }
    }
  } catch (e) {
    // Module not found or other error, just continue with default auth
  }
  
  // Environment flags
  const isLocalhost = isLocalhostEnvironment();
  const currentOrigin = getCurrentOrigin();
  
  // Automatically reconnect if we were previously connected
  useEffect(() => {
    const reconnectIfNeeded = async () => {
      // Check if we have a recent connection (within the last 24 hours)
      const lastConnectedTime = lastConnected || 0;
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
      const wasRecentlyConnected = lastConnectedTime > twentyFourHoursAgo;
      
      // If we're an admin or we were recently connected, and we have a saved host, try to reconnect
      if ((auth.isAdmin || wasRecentlyConnected) && 
          localStorage.getItem('ollamaHost') && 
          !connectionStatus?.connected) {
        console.log("Automatically reconnecting to Ollama...");
        await connectToDocker(localStorage.getItem('ollamaHost') || 'http://localhost:11434');
      }
    };
    
    reconnectIfNeeded();
    
    // Add reconnection on visibility change (when user returns to the tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !connectionStatus?.connected) {
        reconnectIfNeeded();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [auth.isAdmin, connectionStatus?.connected, lastConnected]);

  // Connection auto-retry strategy
  useEffect(() => {
    // Only proceed if auto retry is enabled and we don't have an active connection
    if (!autoRetryEnabled || connectionStatus?.connected) {
      return;
    }

    // Only try automatically if we haven't already attempted a connection
    if (connectionAttempts === 0) {
      console.log("Starting automatic connection sequence");
      connectToDocker(getInitialConnectionAddress());
      setConnectionAttempts(prev => prev + 1);
    }
  }, [autoRetryEnabled, connectionAttempts, connectionStatus?.connected]);

  const connectToDocker = async (address: string): Promise<boolean | void> => {
    setIsConnecting(true);
    
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
        localStorage.setItem('ollamaLastConnected', Date.now().toString());
        setLastConnected(Date.now());
        
        const newStatus = {
          connected: true,
          modelsCount: result.models?.length || 0
        };
        
        updateConnectionStatus(newStatus);
        
        // Reset attempts counter on successful connection
        setConnectionAttempts(0);
        setAlternativePortsAttempted(false);
        
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
    localStorage.removeItem('ollamaLastConnected');
    setLastConnected(null);
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
