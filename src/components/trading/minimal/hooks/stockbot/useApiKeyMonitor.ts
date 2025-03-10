
import { useState, useCallback, useEffect, useRef } from "react";
import { showApiKeyDetectedToast } from "@/components/chat/api-keys/ApiKeyToastNotification";
import { toast } from "@/hooks/use-toast";
import { useApiKeyValidator } from "./useApiKeyValidator";
import { useApiKeyEvents } from "./useApiKeyEvents";
import { broadcastApiKeyChange } from "@/utils/apiKeyManager";
import { checkApiKeysAvailability } from "@/hooks/trading-chart/api-key-manager";

/**
 * Hook for monitoring API key status with improved reliability
 * and admin key detection
 */
export const useApiKeyMonitor = (isSimulationMode: boolean, setIsSimulationMode: (mode: boolean) => void) => {
  const [hasGroqKey, setHasGroqKey] = useState<boolean>(false);
  const [isCheckingAdminKey, setIsCheckingAdminKey] = useState<boolean>(false);
  const lastKeyCheckTime = useRef(0);
  const manuallySetMode = useRef(false);
  const checkedThisSession = useRef(false);
  const checkLock = useRef(false);
  const adminKeyChecked = useRef(false);
  
  const { validateGroqApiKey } = useApiKeyValidator();
  
  // Enhanced API key check that looks for both local and admin keys
  const checkGroqApiKey = useCallback(async () => {
    // Prevent reentrant checks
    if (checkLock.current) {
      console.log("API key check already in progress, skipping duplicate check");
      return hasGroqKey;
    }
    
    // Debounce checks (no more than once every 1000ms)
    const now = Date.now();
    if (now - lastKeyCheckTime.current < 1000) {
      return hasGroqKey;
    }
    
    checkLock.current = true;
    lastKeyCheckTime.current = now;
    
    try {
      // First check for a local API key
      let keyExists = await validateGroqApiKey(false);
      
      // If no local key found, check for admin keys
      if (!keyExists && !adminKeyChecked.current) {
        setIsCheckingAdminKey(true);
        console.log("No local Groq API key found, checking for admin key...");
        
        try {
          // Check if there's an admin API key available
          const result = await checkApiKeysAvailability('groq');
          keyExists = result.available;
          
          console.log('Admin API key availability check result:', {
            available: result.available,
            provider: 'groq',
            timestamp: new Date().toISOString()
          });
          
          adminKeyChecked.current = true;
        } catch (err) {
          console.error("Error checking admin API keys:", err);
        } finally {
          setIsCheckingAdminKey(false);
        }
      }
      
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
      // Reset admin key check status on mount
      adminKeyChecked.current = false;
      const initialKeyStatus = await checkGroqApiKey();
      console.log('Initial API key status:', { exists: initialKeyStatus });
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
    adminKeyChecked.current = false;
    
    try {
      // Force immediate check
      const keyExists = await checkGroqApiKey();
      console.log('Force reloaded API key status:', { 
        exists: keyExists,
        timestamp: new Date().toISOString()
      });
      
      // Broadcast the change to all components
      broadcastApiKeyChange('groq', keyExists);
      
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
          description: "No Groq API key could be found in storage or admin configuration",
          variant: "warning",
          duration: 3000
        });
      }
    } catch (err) {
      console.error("Error forcing API key reload:", err);
      checkLock.current = false;
    }
  }, [checkGroqApiKey]);
  
  return { 
    hasGroqKey, 
    checkGroqApiKey,
    isCheckingAdminKey,
    reloadApiKeys,
    setManuallySetMode: (value: boolean) => {
      manuallySetMode.current = value;
    }
  };
};
