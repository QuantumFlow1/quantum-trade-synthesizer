
import { useState, useEffect, useCallback } from 'react';
import { ConnectionStatus } from './ollama/types';
import { useConnectionPersistence } from './ollama/useConnectionPersistence';
import { isLocalhostEnvironment, getCurrentOrigin } from './ollama/connectionUtils';

export function useOllamaDockerConnect() {
  const [dockerAddress, setDockerAddress] = useState<string>('http://localhost:11434');
  const [customAddress, setCustomAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [useServerSideProxy, setUseServerSideProxy] = useState<boolean>(false);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState<boolean>(true);
  
  const { connectionStatus, updateConnectionStatus } = useConnectionPersistence();
  
  const isLocalhost = isLocalhostEnvironment();
  const currentOrigin = getCurrentOrigin();

  // Connect to Ollama API endpoint
  const connectToDocker = useCallback(async (address: string) => {
    setIsConnecting(true);
    
    try {
      console.log(`Connecting to Ollama at ${address}...`);
      
      // Try to fetch the list of models to verify connection
      const response = await fetch(`${address}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const modelsCount = data.models?.length || 0;
        
        console.log(`Successfully connected to Ollama. Found ${modelsCount} models.`);
        
        // Update connection status
        updateConnectionStatus({
          connected: true,
          modelsCount
        });
        
        // Save the successful address
        setDockerAddress(address);
        localStorage.setItem('ollamaDockerAddress', address);
        
        return true;
      } else {
        const errorData = await response.text();
        throw new Error(`API error: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Failed to connect to Ollama:', error);
      
      // Update connection status with error
      updateConnectionStatus({
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [updateConnectionStatus]);

  // Toggle auto-retry functionality
  const toggleAutoRetry = useCallback(() => {
    setAutoRetryEnabled(prev => !prev);
  }, []);

  // Try to connect on initial load if we have a saved address
  useEffect(() => {
    const savedAddress = localStorage.getItem('ollamaDockerAddress');
    if (savedAddress) {
      setDockerAddress(savedAddress);
      
      // If auto-retry is enabled and we're not already connected, attempt to connect
      if (autoRetryEnabled && !connectionStatus?.connected) {
        connectToDocker(savedAddress);
      }
    }
  }, [autoRetryEnabled, connectionStatus?.connected, connectToDocker]);

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
