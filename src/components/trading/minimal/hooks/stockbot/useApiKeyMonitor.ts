
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
    }
  }, []);
  
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
      hasGroqKeyState: hasGroqKey
    });
    
    // If we have key in localStorage but state doesn't match, update immediately
    if (directKeyCheck && !hasGroqKey) {
      console.log('Updating hasGroqKey state based on direct localStorage check');
      setHasGroqKey(true);
    }
    
    // Debounce checks (no more than once every 1000ms)
    const now = Date.now();
    if (now - lastKeyCheckTime.current < 1000) {
      return hasGroqKey;
    }
    
    checkLock.current = true;
    lastKeyCheckTime.current = now;
    
    try {
      const keyExists = await validateGroqApiKey();
      
      if (keyExists !== hasGroqKey || !checkedThisSession.current) {
        checkedThisSession.current = true;
        console.log('useApiKeyMonitor - API key status change detected:', {
          exists: keyExists,
          previousState: hasGroqKey,
          timestamp: new Date().toISOString()
        });
        
        setHasGroqKey(keyExists);
        
        // Only auto-switch modes if we haven't been manually set
        // AND this isn't just the initial check (to prevent unwanted toasts on load)
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
        
        toast({
          title: "API Key Detected",
          description: "Groq API key has been detected and is ready to use",
          duration: 3000
        });
        
        // Broadcast the change
        broadcastApiKeyChange(true);
        
        if (isSimulationMode && !manuallySetMode.current) {
          console.log('Switching from simulation mode to AI mode after finding key');
          setIsSimulationMode(false);
        }
        
        return;
      }
      
      // If direct check failed, do a full validation
      const keyExists = await checkGroqApiKey();
      console.log('Force reloaded API key status:', { 
        exists: keyExists,
        timestamp: new Date().toISOString()
      });
      
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
    } catch (err) {
      console.error("Error forcing API key reload:", err);
      checkLock.current = false;
    }
  }, [checkGroqApiKey, isSimulationMode, setIsSimulationMode]);
  
  return { 
    hasGroqKey, 
    checkGroqApiKey, 
    reloadApiKeys,
    setManuallySetMode: (value: boolean) => {
      manuallySetMode.current = value;
    }
  };
};
