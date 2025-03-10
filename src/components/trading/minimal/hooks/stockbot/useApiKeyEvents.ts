
import { useEffect } from 'react';
import { broadcastApiKeyChange } from '@/utils/apiKeyManager';

// Custom event names for API key updates
const API_KEY_UPDATED_EVENT = 'apikey-updated';
const LOCALSTORAGE_CHANGED_EVENT = 'storage';

/**
 * Hook to listen for API key change events
 * @param callback Function to call when API key changes
 */
export const useApiKeyEvents = (callback: () => void) => {
  useEffect(() => {
    // Handler for API key update events
    const handleApiKeyUpdate = () => {
      console.log('API key update detected');
      callback();
    };
    
    // Listen for both custom apikey-updated event and storage event
    window.addEventListener(API_KEY_UPDATED_EVENT, handleApiKeyUpdate);
    window.addEventListener(LOCALSTORAGE_CHANGED_EVENT, handleApiKeyUpdate);
    
    return () => {
      window.removeEventListener(API_KEY_UPDATED_EVENT, handleApiKeyUpdate);
      window.removeEventListener(LOCALSTORAGE_CHANGED_EVENT, handleApiKeyUpdate);
    };
  }, [callback]);
  
  // Function to manually trigger API key change events
  const triggerApiKeyChange = () => {
    broadcastApiKeyChange();
  };

  return { triggerApiKeyChange };
};
