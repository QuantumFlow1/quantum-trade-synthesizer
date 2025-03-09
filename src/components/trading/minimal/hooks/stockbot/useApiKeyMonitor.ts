
import { useState, useCallback, useEffect, useRef } from "react";
import { hasApiKey, API_KEY_UPDATED_EVENT, LOCALSTORAGE_CHANGED_EVENT } from "@/utils/apiKeyManager";
import { showApiKeyDetectedToast, showApiKeyErrorToast } from "@/components/chat/api-keys/ApiKeyToastNotification";
import { toast } from "@/hooks/use-toast";

/**
 * Hook for monitoring API key status with improved reliability
 */
export const useApiKeyMonitor = (isSimulationMode: boolean, setIsSimulationMode: (mode: boolean) => void) => {
  const [hasGroqKey, setHasGroqKey] = useState<boolean>(false);
  const apiKeyCheckTimerId = useRef<number | null>(null);
  const lastKeyCheckTime = useRef(0);
  const manuallySetMode = useRef(false);
  
  // Check if the Groq API key exists with improved caching
  const checkGroqApiKey = useCallback(() => {
    // Skip frequent checks (no more than once every 500ms)
    const now = Date.now();
    if (now - lastKeyCheckTime.current < 500) {
      return hasGroqKey;
    }
    
    lastKeyCheckTime.current = now;
    const keyExists = hasApiKey('groq');
    const groqKeyValue = localStorage.getItem('groqApiKey');
    
    console.log('useApiKeyMonitor - API key check:', {
      exists: keyExists,
      keyLength: groqKeyValue ? groqKeyValue.length : 0,
      previousState: hasGroqKey,
      timestamp: new Date().toISOString()
    });
    
    if (keyExists !== hasGroqKey) {
      console.log('useApiKeyMonitor - API key status change detected:', {
        exists: keyExists,
        previousState: hasGroqKey,
        keyLength: groqKeyValue ? groqKeyValue.length : 0
      });
      
      setHasGroqKey(keyExists);
      
      // Only auto-switch modes if we haven't been manually set
      if (!manuallySetMode.current) {
        if (keyExists && isSimulationMode) {
          console.log('API key exists but still in simulation mode - switching to AI mode');
          setIsSimulationMode(false);
          showApiKeyDetectedToast('Groq');
        } else if (!keyExists && !isSimulationMode) {
          console.log('No API key found but not in simulation mode - switching to simulation mode');
          setIsSimulationMode(true);
          toast({
            title: "Simulation Mode Activated",
            description: "No API key found, switching to simulation mode",
            variant: "warning"
          });
        }
      }
    }
    
    return keyExists;
  }, [hasGroqKey, isSimulationMode, setIsSimulationMode]);
  
  // Force reload API keys
  const reloadApiKeys = useCallback(() => {
    console.log('Forced reload of API keys requested');
    // Clear any cached state that might be preventing updates
    localStorage.removeItem('_dummy_key_');
    
    // Force immediate check
    const keyExists = checkGroqApiKey();
    console.log('Force reloaded API key status:', { exists: keyExists });
    
    // Broadcast the change to all components
    window.dispatchEvent(new Event(API_KEY_UPDATED_EVENT));
    
    // Show toast notification
    if (keyExists) {
      toast({
        title: "API Key Detected",
        description: "Groq API key has been detected and is ready to use",
        duration: 3000
      });
    } else {
      toast({
        title: "No API Key Found",
        description: "No Groq API key could be found in storage",
        variant: "warning",
        duration: 3000
      });
    }
  }, [checkGroqApiKey]);
  
  // Setup event listeners for API key changes with improved reliability
  useEffect(() => {
    // Run initial check immediately
    const initialKeyStatus = checkGroqApiKey();
    console.log('Initial API key status:', { exists: initialKeyStatus });
    
    // Set up event listeners
    const handleApiKeyUpdate = () => {
      console.log("Key event listener triggered");
      checkGroqApiKey();
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
      
      apiKeyCheckTimerId.current = window.setInterval(checkGroqApiKey, 2000);
    }
    
    // Try to use BroadcastChannel if available for cross-tab communication
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('api-key-updates');
      broadcastChannel.onmessage = (event) => {
        console.log('Received broadcast channel message:', event.data);
        if (event.data.type === 'api-key-update') {
          checkGroqApiKey();
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
  }, [checkGroqApiKey]);
  
  return { 
    hasGroqKey, 
    checkGroqApiKey, 
    reloadApiKeys,
    setManuallySetMode: (value: boolean) => {
      manuallySetMode.current = value;
    }
  };
};
