
import { useState, useEffect } from 'react';
import { ConnectionStatus } from './types';

/**
 * Hook to manage persisting and loading connection status
 */
export function useConnectionPersistence() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(() => {
    // Immediately load connection status from localStorage on initialization
    const savedConnection = localStorage.getItem('ollamaConnectionStatus');
    if (savedConnection) {
      try {
        return JSON.parse(savedConnection);
      } catch (e) {
        console.error('Error parsing saved connection status:', e);
        return null;
      }
    }
    return null;
  });
  
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
