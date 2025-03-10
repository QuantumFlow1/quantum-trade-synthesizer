
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
      try {
        // Prevent re-entrancy and throttle executions
        if (processingEvent.current) return;
        
        const now = Date.now();
        if (now - lastCheckTime.current < 1000) return; // Minimum 1000ms between checks
        
        lastCheckTime.current = now;
        processingEvent.current = true;
        
        console.log("API key event listener triggered");
        onApiKeyChange();
        
        // Reset processing flag after a short delay
        setTimeout(() => {
          processingEvent.current = false;
        }, 500);
      } catch (err) {
        console.error("Error in API key event handler:", err);
        processingEvent.current = false;
      }
    };
    
    // Listen to multiple events to ensure we catch all changes
    window.addEventListener(API_KEY_UPDATED_EVENT, handleApiKeyUpdate);
    window.addEventListener(LOCALSTORAGE_CHANGED_EVENT, handleApiKeyUpdate);
    window.addEventListener('storage', handleApiKeyUpdate);
    
    // Use a less frequent interval (15 seconds instead of 10) to reduce CPU usage
    if (typeof window !== 'undefined') {
      if (apiKeyCheckTimerId.current) {
        clearInterval(apiKeyCheckTimerId.current);
      }
      
      apiKeyCheckTimerId.current = window.setInterval(() => {
        try {
          if (!processingEvent.current) {
            onApiKeyChange();
          }
        } catch (err) {
          console.error("Error in interval API key check:", err);
          processingEvent.current = false;
        }
      }, 15000); // Check every 15 seconds instead of 10 seconds
    }
    
    // Try to use BroadcastChannel if available for cross-tab communication
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('api-key-updates');
      broadcastChannel.onmessage = (event) => {
        try {
          if (event.data.type === 'api-key-update' && !processingEvent.current) {
            handleApiKeyUpdate();
          }
        } catch (err) {
          console.error("Error handling broadcast message:", err);
          processingEvent.current = false;
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
        try {
          broadcastChannel.close();
        } catch (err) {
          console.error("Error closing broadcast channel:", err);
        }
      }
    };
  }, [onApiKeyChange]);
};
