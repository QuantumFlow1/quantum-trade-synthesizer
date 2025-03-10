
import { useEffect, useRef } from "react";
import { API_KEY_UPDATED_EVENT, LOCALSTORAGE_CHANGED_EVENT } from "@/utils/apiKeyManager";

/**
 * Hook for API key event handling
 */
export const useApiKeyEvents = (
  onApiKeyChange: () => void
) => {
  const apiKeyCheckTimerId = useRef<number | null>(null);
  const lastCheckTime = useRef<number>(0);
  const processingEvent = useRef<boolean>(false);

  // Setup event listeners for API key changes with improved reliability
  useEffect(() => {
    // Throttled handler to prevent multiple rapid executions
    const handleApiKeyUpdate = () => {
      // Prevent re-entrancy and throttle executions
      if (processingEvent.current) return;
      
      const now = Date.now();
      if (now - lastCheckTime.current < 500) return; // Minimum 500ms between checks
      
      lastCheckTime.current = now;
      processingEvent.current = true;
      
      console.log("API key event listener triggered");
      onApiKeyChange();
      
      // Reset processing flag after a short delay
      setTimeout(() => {
        processingEvent.current = false;
      }, 100);
    };
    
    // Listen to multiple events to ensure we catch all changes
    window.addEventListener(API_KEY_UPDATED_EVENT, handleApiKeyUpdate);
    window.addEventListener(LOCALSTORAGE_CHANGED_EVENT, handleApiKeyUpdate);
    window.addEventListener('storage', handleApiKeyUpdate);
    
    // Use a less frequent interval (10 seconds instead of 2) to reduce CPU usage
    if (typeof window !== 'undefined') {
      if (apiKeyCheckTimerId.current) {
        clearInterval(apiKeyCheckTimerId.current);
      }
      
      apiKeyCheckTimerId.current = window.setInterval(() => {
        if (!processingEvent.current) {
          onApiKeyChange();
        }
      }, 10000); // Check every 10 seconds instead of 2 seconds
    }
    
    // Try to use BroadcastChannel if available for cross-tab communication
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('api-key-updates');
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'api-key-update' && !processingEvent.current) {
          handleApiKeyUpdate();
        }
      };
    } catch (err) {
      console.log('BroadcastChannel not supported:', err);
    }
    
    return () => {
      window.removeEventListener(API_KEY_UPDATED_EVENT, handleApiKeyUpdate);
      window.removeEventListener(LOCALSTORAGE_CHANGED_EVENT, handleApiKeyUpdate);
      window.removeEventListener('storage', handleApiKeyUpdate);
      
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
