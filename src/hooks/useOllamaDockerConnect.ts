
import { useState, useEffect, useCallback } from 'react';
import { ConnectionStatus } from './ollama/types';
import { useConnectionPersistence } from './ollama/useConnectionPersistence';
import { isLocalhostEnvironment, getCurrentOrigin } from './ollama/connectionUtils';
import { useAuth } from '@/components/auth/AuthProvider';

export function useOllamaDockerConnect() {
  const [dockerAddress, setDockerAddress] = useState<string>('http://localhost:11434');
  const [customAddress, setCustomAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [useServerSideProxy, setUseServerSideProxy] = useState<boolean>(false);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState<boolean>(true);
  const [lastConnectedTimestamp, setLastConnectedTimestamp] = useState<number>(
    parseInt(localStorage.getItem('ollamaLastConnected') || '0')
  );
  
  const { connectionStatus, updateConnectionStatus } = useConnectionPersistence();
  const { isAdmin } = useAuth();
  
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
        
        // Save the successful address and timestamp
        setDockerAddress(address);
        localStorage.setItem('ollamaDockerAddress', address);
        
        const now = Date.now();
        setLastConnectedTimestamp(now);
        localStorage.setItem('ollamaLastConnected', now.toString());
        
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
    setAutoRetryEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('ollamaAutoRetryEnabled', String(newValue));
      return newValue;
    });
  }, []);

  // Load saved settings on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('ollamaDockerAddress');
    if (savedAddress) {
      setDockerAddress(savedAddress);
    }

    const savedAutoRetry = localStorage.getItem('ollamaAutoRetryEnabled');
    if (savedAutoRetry !== null) {
      setAutoRetryEnabled(savedAutoRetry === 'true');
    }
  }, []);

  // Try to reconnect if conditions are met:
  // 1. Admin user (special persistence for admins)
  // 2. Auto-retry is enabled
  // 3. We're not already connected
  // 4. Last connection was recent enough (less than 1 hour ago) or connection status is unknown
  useEffect(() => {
    const shouldAutoConnect = 
      (isAdmin || autoRetryEnabled) && 
      (!connectionStatus?.connected) &&
      (Date.now() - lastConnectedTimestamp < 3600000 || !connectionStatus);
    
    if (shouldAutoConnect) {
      console.log('Auto-reconnecting to Ollama...');
      const savedAddress = localStorage.getItem('ollamaDockerAddress') || 'http://localhost:11434';
      connectToDocker(savedAddress);
    }
  }, [isAdmin, autoRetryEnabled, connectionStatus, lastConnectedTimestamp, connectToDocker]);

  // Reconnect on window focus, especially for admin users
  useEffect(() => {
    const handleFocus = () => {
      if (isAdmin && !connectionStatus?.connected) {
        const savedAddress = localStorage.getItem('ollamaDockerAddress') || 'http://localhost:11434';
        connectToDocker(savedAddress);
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAdmin, connectionStatus, connectToDocker]);

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
