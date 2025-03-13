
import { useEffect } from 'react';
import { saveApiKey } from './storage';

export function useApiKeyEvents() {
  useEffect(() => {
    // Handler for messages from content script
    const handleKeyUpdate = (event: MessageEvent) => {
      if (event?.data?.type === 'apiKeyUpdate' && event?.data?.key) {
        // Save the API key sent from the extension
        const { provider, key } = event.data;
        
        if (provider && key && typeof key === 'string') {
          console.log(`Received ${provider} API key update from extension`);
          saveApiKey(provider, key);
        }
      }
    };
    
    // Listen for messages from content script
    window.addEventListener('message', handleKeyUpdate);
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('ApiKey') && e.newValue) {
        const provider = e.key.replace('ApiKey', '').toLowerCase();
        // Notify other components about the API key change
        window.dispatchEvent(new CustomEvent('apikey-updated', {
          detail: { provider, action: 'save' }
        }));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      window.removeEventListener('message', handleKeyUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
}
