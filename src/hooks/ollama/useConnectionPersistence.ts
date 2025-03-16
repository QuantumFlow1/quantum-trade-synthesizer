
import { useState, useEffect } from 'react';
import { ConnectionStatus } from './types';

/**
 * Hook to manage persisting and loading connection status
 */
export function useConnectionPersistence() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  
  // Load saved connection status on init
  useEffect(() => {
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
  
  // Helper to update and persist connection status
  const updateConnectionStatus = (newStatus: ConnectionStatus) => {
    setConnectionStatus(newStatus);
    localStorage.setItem('ollamaConnectionStatus', JSON.stringify(newStatus));
  };

  return {
    connectionStatus,
    updateConnectionStatus
  };
}
