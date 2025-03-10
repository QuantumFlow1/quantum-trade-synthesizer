
import { useState, useEffect, useRef, useCallback } from "react";
import { fetchAdminApiKey } from "@/components/chat/services/utils/apiHelpers";
import { toast } from "@/hooks/use-toast";

export type CheckGroqApiKeyFunction = () => Promise<boolean>;

export const useApiKeyMonitor = (
  isSimulationMode: boolean,
  setIsSimulationMode: (mode: boolean) => void
) => {
  const [hasGroqKey, setHasGroqKey] = useState<boolean>(false);
  const [isCheckingAdminKey, setIsCheckingAdminKey] = useState<boolean>(false);
  const manuallySetMode = useRef<boolean>(false);
  
  // Check if Groq API key is available in localStorage
  const checkLocalGroqApiKey = useCallback(() => {
    const key = localStorage.getItem('groqApiKey');
    const hasKey = !!key && key.length > 10;
    
    console.log('Checking local Groq API key:', {
      exists: hasKey,
      keyLength: key ? key.length : 0
    });
    
    return hasKey;
  }, []);
  
  // Check for admin API key
  const checkAdminGroqApiKey = useCallback(async (): Promise<boolean> => {
    try {
      setIsCheckingAdminKey(true);
      const adminKey = await fetchAdminApiKey('groq');
      setIsCheckingAdminKey(false);
      return !!adminKey;
    } catch (error) {
      console.error('Error checking admin Groq API key:', error);
      setIsCheckingAdminKey(false);
      return false;
    }
  }, []);
  
  // Comprehensive API key check that combines local and admin checks
  const checkGroqApiKey = useCallback(async (): Promise<boolean> => {
    // Check localStorage first (faster)
    const hasLocalKey = checkLocalGroqApiKey();
    
    if (hasLocalKey) {
      console.log('Valid local Groq API key found');
      setHasGroqKey(true);
      return true;
    }
    
    // If no local key, check for admin key
    const hasAdminKey = await checkAdminGroqApiKey();
    console.log('Admin Groq API key check result:', hasAdminKey);
    
    setHasGroqKey(hasAdminKey);
    
    // If no key available and simulation mode is not manually set, enable simulation
    if (!hasAdminKey && !manuallySetMode.current && !isSimulationMode) {
      console.log('No API key available, enabling simulation mode automatically');
      setIsSimulationMode(true);
    }
    
    return hasAdminKey;
  }, [checkLocalGroqApiKey, checkAdminGroqApiKey, isSimulationMode, setIsSimulationMode]);
  
  // Reload API keys and update state
  const reloadApiKeys = useCallback(async () => {
    const result = await checkGroqApiKey();
    
    // Only auto-switch to AI mode if keys are available and user hasn't manually set the mode
    if (result && isSimulationMode && !manuallySetMode.current) {
      console.log('API key available, automatically switching to AI mode');
      setIsSimulationMode(false);
      toast({
        title: "AI Mode Activated",
        description: "Groq API key detected. Now using AI-powered responses.",
        duration: 3000
      });
    }
    
    return result;
  }, [checkGroqApiKey, isSimulationMode, setIsSimulationMode]);
  
  // Set manuallySetMode flag
  const setManuallySetMode = useCallback((value: boolean) => {
    manuallySetMode.current = value;
  }, []);
  
  // Initial check on mount and set up listeners for API key changes
  useEffect(() => {
    checkGroqApiKey();
    
    const handleLocalStorageChange = () => {
      checkGroqApiKey();
    };
    
    // Listen for localStorage changes or API key updates
    window.addEventListener('storage', handleLocalStorageChange);
    window.addEventListener('apikey-updated', handleLocalStorageChange);
    window.addEventListener('localStorage-changed', handleLocalStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleLocalStorageChange);
      window.removeEventListener('apikey-updated', handleLocalStorageChange);
      window.removeEventListener('localStorage-changed', handleLocalStorageChange);
    };
  }, [checkGroqApiKey]);
  
  return {
    hasGroqKey,
    checkGroqApiKey,
    isCheckingAdminKey,
    reloadApiKeys,
    setManuallySetMode
  };
};
