
import { useEffect } from 'react';

/**
 * Hook for listening to API key storage events
 */
export const useApiKeyEvents = (checkApiKey: () => Promise<boolean>) => {
  useEffect(() => {
    // Create event handlers with clear names
    const handleApiKeyUpdated = () => {
      console.log('API key updated event received');
      checkApiKey();
    };

    const handleStorageChange = (event: StorageEvent) => {
      // Only process events related to API keys
      if (event.key === 'groqApiKey' || event.key === null) {
        console.log('Storage change event received for API key');
        checkApiKey();
      }
    };

    const handleLocalStorageChanged = () => {
      console.log('Local storage changed event received');
      checkApiKey();
    };

    // Attach event listeners
    window.addEventListener('apikey-updated', handleApiKeyUpdated);
    window.addEventListener('localStorage-changed', handleLocalStorageChanged);
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdated);
      window.removeEventListener('localStorage-changed', handleLocalStorageChanged); 
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkApiKey]);
};
