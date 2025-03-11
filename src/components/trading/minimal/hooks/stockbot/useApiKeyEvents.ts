
import { useEffect, useCallback } from 'react';
import { broadcastApiKeyChange } from '@/utils/apiKeyManager';

export interface ApiKeyEvent {
  type: 'api-key-update';
  keyType: string;
  isAvailable: boolean;
}

/**
 * Hook to listen for API key events from other tabs
 */
export const useApiKeyEvents = (
  onApiKeyChange?: (keyType: string, isAvailable: boolean) => void
) => {
  const handleApiKeyEvent = useCallback((event: MessageEvent<ApiKeyEvent>) => {
    const { type, keyType, isAvailable } = event.data;
    
    if (type === 'api-key-update' && onApiKeyChange) {
      console.log(`API key update event received for ${keyType}: ${isAvailable ? 'available' : 'unavailable'}`);
      onApiKeyChange(keyType, isAvailable);
    }
  }, [onApiKeyChange]);

  // Set up broadcast channel listener
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    
    try {
      channel = new BroadcastChannel('api-key-updates');
      channel.addEventListener('message', handleApiKeyEvent);
      
      // Notify other components that we're listening
      broadcastApiKeyChange('groq', false);
    } catch (error) {
      console.error('Error setting up BroadcastChannel:', error);
    }
    
    return () => {
      if (channel) {
        channel.removeEventListener('message', handleApiKeyEvent);
        channel.close();
      }
    };
  }, [handleApiKeyEvent]);

  return null;
};

export default useApiKeyEvents;
