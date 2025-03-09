
import { useState, useCallback, useEffect, useRef } from "react";
import { showApiKeyDetectedToast } from "@/components/chat/api-keys/ApiKeyToastNotification";
import { toast } from "@/hooks/use-toast";
import { useApiKeyValidator } from "./useApiKeyValidator";
import { useApiKeyEvents } from "./useApiKeyEvents";
import { broadcastApiKeyChange } from "@/utils/apiKeyManager";

/**
 * Hook for monitoring API key status with improved reliability
 */
export const useApiKeyMonitor = (isSimulationMode: boolean, setIsSimulationMode: (mode: boolean) => void) => {
  const [hasGroqKey, setHasGroqKey] = useState<boolean>(false);
  const lastKeyCheckTime = useRef(0);
  const manuallySetMode = useRef(false);
  
  const { validateGroqApiKey } = useApiKeyValidator();
  
  // Check if the Groq API key exists with improved caching
  const checkGroqApiKey = useCallback(() => {
    // Skip frequent checks (no more than once every 500ms)
    const now = Date.now();
    if (now - lastKeyCheckTime.current < 500) {
      return hasGroqKey;
    }
    
    lastKeyCheckTime.current = now;
    const keyExists = validateGroqApiKey();
    
    if (keyExists !== hasGroqKey) {
      console.log('useApiKeyMonitor - API key status change detected:', {
        exists: keyExists,
        previousState: hasGroqKey
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
  }, [hasGroqKey, isSimulationMode, setIsSimulationMode, validateGroqApiKey]);
  
  // Setup API key event handling
  useApiKeyEvents(checkGroqApiKey);
  
  // Run initial check immediately
  useEffect(() => {
    const initialKeyStatus = checkGroqApiKey();
    console.log('Initial API key status:', { exists: initialKeyStatus });
  }, [checkGroqApiKey]);
  
  // Force reload API keys
  const reloadApiKeys = useCallback(() => {
    console.log('Forced reload of API keys requested');
    // Clear any cached state that might be preventing updates
    localStorage.removeItem('_dummy_key_');
    
    // Force immediate check
    const keyExists = checkGroqApiKey();
    console.log('Force reloaded API key status:', { exists: keyExists });
    
    // Broadcast the change to all components
    broadcastApiKeyChange(keyExists);
    
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
  
  return { 
    hasGroqKey, 
    checkGroqApiKey, 
    reloadApiKeys,
    setManuallySetMode: (value: boolean) => {
      manuallySetMode.current = value;
    }
  };
};
