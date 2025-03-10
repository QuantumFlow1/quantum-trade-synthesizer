
import { useEffect } from 'react';
import { API_KEY_UPDATED_EVENT, LOCALSTORAGE_CHANGED_EVENT } from '@/utils/apiKeyManager';

/**
 * Hook for listening to API key storage events
 */
export const useApiKeyEvents = (checkApiKey: () => Promise<boolean>) => {
  useEffect(() => {
    // Create event handlers with clear names
    const handleApiKeyUpdated = (event?: CustomEvent) => {
      console.log('API key updated event received', event?.detail);
      checkApiKey();
    };

    const handleStorageChange = (event: StorageEvent) => {
      // Only process events related to API keys
      if (event.key === 'groqApiKey' || event.key === null) {
        console.log('Storage change event received for API key', {
          key: event.key,
          newValue: event.newValue ? `${event.newValue.substring(0, 3)}...` : null,
          oldValue: event.oldValue ? `${event.oldValue.substring(0, 3)}...` : null
        });
        checkApiKey();
      }
    };

    const handleLocalStorageChanged = (event?: CustomEvent) => {
      console.log('Local storage changed event received', event?.detail);
      checkApiKey();
    };

    // Attach event listeners
    window.addEventListener(API_KEY_UPDATED_EVENT, handleApiKeyUpdated as EventListener);
    window.addEventListener(LOCALSTORAGE_CHANGED_EVENT, handleLocalStorageChanged as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    // Run an initial check on mount
    checkApiKey();
    
    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener(API_KEY_UPDATED_EVENT, handleApiKeyUpdated as EventListener);
      window.removeEventListener(LOCALSTORAGE_CHANGED_EVENT, handleLocalStorageChanged as EventListener); 
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkApiKey]);
};
