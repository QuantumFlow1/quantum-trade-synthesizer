
import { useEffect, useRef } from "react";
import { API_KEY_UPDATED_EVENT, LOCALSTORAGE_CHANGED_EVENT } from "@/utils/apiKeyManager";

/**
 * Hook for API key event handling
 */
export const useApiKeyEvents = (
  onApiKeyChange: () => void
) => {
  const apiKeyCheckTimerId = useRef<number | null>(null);

  // Setup event listeners for API key changes with improved reliability
  useEffect(() => {
    // Set up event listeners
    const handleApiKeyUpdate = () => {
      console.log("API key event listener triggered");
      onApiKeyChange();
    };
    
    // Listen to multiple events to ensure we catch all changes
    window.addEventListener(API_KEY_UPDATED_EVENT, handleApiKeyUpdate);
    window.addEventListener(LOCALSTORAGE_CHANGED_EVENT, handleApiKeyUpdate);
    window.addEventListener('storage', handleApiKeyUpdate);
    window.addEventListener('focus', handleApiKeyUpdate); // Check when window regains focus
    
    // Check frequently for API key changes
    if (typeof window !== 'undefined') {
      if (apiKeyCheckTimerId.current) {
        clearInterval(apiKeyCheckTimerId.current);
      }
      
      apiKeyCheckTimerId.current = window.setInterval(onApiKeyChange, 2000);
    }
    
    // Try to use BroadcastChannel if available for cross-tab communication
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('api-key-updates');
      broadcastChannel.onmessage = (event) => {
        console.log('Received broadcast channel message:', event.data);
        if (event.data.type === 'api-key-update') {
          onApiKeyChange();
        }
      };
    } catch (err) {
      console.log('BroadcastChannel not supported:', err);
    }
    
    return () => {
      window.removeEventListener(API_KEY_UPDATED_EVENT, handleApiKeyUpdate);
      window.removeEventListener(LOCALSTORAGE_CHANGED_EVENT, handleApiKeyUpdate);
      window.removeEventListener('storage', handleApiKeyUpdate);
      window.removeEventListener('focus', handleApiKeyUpdate);
      
      if (apiKeyCheckTimerId.current) {
        clearInterval(apiKeyCheckTimerId.current);
        apiKeyCheckTimerId.current = null;
      }
      
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, [onApiKeyChange]);
};
