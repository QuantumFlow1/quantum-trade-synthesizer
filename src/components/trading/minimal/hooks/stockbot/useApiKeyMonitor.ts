
import { useState, useCallback, useEffect, useRef } from "react";
import { showApiKeyDetectedToast } from "@/components/chat/api-keys/ApiKeyToastNotification";
import { toast } from "@/hooks/use-toast";
import { useApiKeyValidator } from "./useApiKeyValidator";
import { useApiKeyEvents } from "./useApiKeyEvents";
import { broadcastApiKeyChange, hasApiKey } from "@/utils/apiKeyManager";

/**
 * Hook for monitoring API key status with improved reliability
 */
export const useApiKeyMonitor = (isSimulationMode: boolean, setIsSimulationMode: (mode: boolean) => void) => {
  const [hasGroqKey, setHasGroqKey] = useState<boolean>(false);
  const lastKeyCheckTime = useRef(0);
  const manuallySetMode = useRef(false);
  const checkedThisSession = useRef(false);
  const checkLock = useRef(false);
  
  // Immediately check if key exists in localStorage on mount
  useEffect(() => {
    const localKeyExists = hasApiKey('groq');
    const groqKey = localStorage.getItem('groqApiKey');
    
    console.log('Initial API key check on mount:', {
      exists: localKeyExists,
      keyLength: groqKey ? groqKey.length : 0,
      firstCheck: true
    });
    
    if (localKeyExists && groqKey && groqKey.trim().length > 0) {
      setHasGroqKey(true);
      
      // If we have a key and we're in simulation mode, switch to AI mode
      if (isSimulationMode) {
        setIsSimulationMode(false);
      }
    }
  }, [isSimulationMode, setIsSimulationMode]);
  
  const { validateGroqApiKey } = useApiKeyValidator();
  
  // Check if the Groq API key exists with improved caching and debouncing
  const checkGroqApiKey = useCallback(async () => {
    // Prevent reentrant checks
    if (checkLock.current) {
      console.log("API key check already in progress, skipping duplicate check");
      return hasGroqKey;
    }
    
    // Check for key first in localStorage directly for faster response
    const directKeyCheck = hasApiKey('groq');
    const groqKey = localStorage.getItem('groqApiKey');
    
    console.log('Direct localStorage check before async validation:', {
      exists: directKeyCheck,
      keyLength: groqKey ? groqKey.length : 0,
      hasGroqKeyState: hasGroqKey,
      timestamp: new Date().toISOString()
    });
    
    // If we have key in localStorage but state doesn't match, update immediately
    if (directKeyCheck && groqKey && groqKey.trim().length > 0 && !hasGroqKey) {
      console.log('Updating hasGroqKey state based on direct localStorage check');
      setHasGroqKey(true);
      
      // If we have a key and we're in simulation mode, switch to AI mode
      if (isSimulationMode) {
        setIsSimulationMode(false);
      }
      
      return true;
    }
    
    // Debounce checks (no more than once every 1000ms)
    const now = Date.now();
    if (now - lastKeyCheckTime.current < 1000) {
      console.log("Skipping API key check due to debounce");
      return hasGroqKey;
    }
    
    checkLock.current = true;
    lastKeyCheckTime.current = now;
    
    try {
      console.log("Performing full API key validation");
      const keyExists = await validateGroqApiKey();
      
      console.log('useApiKeyMonitor - Validation result:', {
        exists: keyExists,
        previousState: hasGroqKey,
        timestamp: new Date().toISOString()
      });
      
      if (keyExists !== hasGroqKey || !checkedThisSession.current) {
        checkedThisSession.current = true;
        console.log('useApiKeyMonitor - API key status change detected:', {
          exists: keyExists,
          previousState: hasGroqKey,
          timestamp: new Date().toISOString()
        });
        
        setHasGroqKey(keyExists);
        
        // Only auto-switch modes if we haven't been manually set
        if (!manuallySetMode.current) {
          if (keyExists && isSimulationMode) {
            console.log('API key exists but still in simulation mode - switching to AI mode');
            setIsSimulationMode(false);
            
            // Only show toast if this isn't the initial page load
            if (hasGroqKey !== keyExists) {
              showApiKeyDetectedToast('Groq');
            }
          } else if (!keyExists && !isSimulationMode) {
            console.log('No API key found but not in simulation mode - switching to simulation mode');
            setIsSimulationMode(true);
            
            // Only show toast if this isn't the initial page load
            if (hasGroqKey !== keyExists) {
              toast({
                title: "Simulation Mode Activated",
                description: "No API key found, switching to simulation mode",
                variant: "warning"
              });
            }
          }
        }
      }
      
      checkLock.current = false;
      return keyExists;
    } catch (err) {
      console.error("Error checking API key:", err);
      checkLock.current = false;
      return hasGroqKey;
    }
  }, [hasGroqKey, isSimulationMode, setIsSimulationMode, validateGroqApiKey]);
  
  // Setup API key event handling with reduced frequency
  useApiKeyEvents(checkGroqApiKey);
  
  // Run initial check on component mount
  useEffect(() => {
    const runInitialCheck = async () => {
      const initialKeyStatus = await checkGroqApiKey();
      console.log('Initial API key status check completed:', { exists: initialKeyStatus });
    };
    runInitialCheck();
  }, [checkGroqApiKey]);
  
  // Force reload API keys
  const reloadApiKeys = useCallback(async () => {
    console.log('Forced reload of API keys requested');
    
    // Skip if a check is already in progress
    if (checkLock.current) {
      console.log("API key check already in progress, deferring reload request");
      setTimeout(reloadApiKeys, 500);
      return;
    }
    
    // Reset cached state to force a fresh check
    lastKeyCheckTime.current = 0;
    checkedThisSession.current = false;
    
    try {
      // First check directly in localStorage for immediate feedback
      const directKeyCheck = hasApiKey('groq');
      const groqKey = localStorage.getItem('groqApiKey');
      
      console.log('Direct localStorage check during reloadApiKeys:', {
        exists: directKeyCheck,
        keyLength: groqKey ? groqKey.length : 0
      });
      
      if (directKeyCheck && groqKey && groqKey.trim().length > 0) {
        console.log('Valid API key found in localStorage during reload');
        setHasGroqKey(true);
        
        // If we're in simulation mode but have a key, switch to AI mode
        if (isSimulationMode) {
          setIsSimulationMode(false);
        }
      }
      
      // Then do the full async check
      await checkGroqApiKey();
    } catch (error) {
      console.error('Error in reloadApiKeys:', error);
    }
  }, [checkGroqApiKey, isSimulationMode, setIsSimulationMode]);
  
  // Expose the key status and manual check function
  return {
    hasGroqKey,
    checkGroqApiKey,
    reloadApiKeys
  };
};
