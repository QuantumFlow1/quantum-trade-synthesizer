
import { useState, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";

export const useApiKeyMonitor = () => {
  const [hasGroqKey, setHasGroqKey] = useState<boolean>(false);
  const [isCheckingAdminKey, setIsCheckingAdminKey] = useState<boolean>(true);
  
  const checkGroqApiKey = useCallback(async (): Promise<boolean> => {
    try {
      setIsCheckingAdminKey(true);
      
      // Check if user has a Groq API key configured
      const groqKey = localStorage.getItem('groqApiKey');
      
      if (!groqKey) {
        console.log('No Groq API key found');
        setHasGroqKey(false);
        return false;
      }
      
      // Check if the key appears to be valid (simple format check)
      if (!groqKey.startsWith('gsk_') || groqKey.length < 20) {
        console.log('Invalid Groq API key format');
        setHasGroqKey(false);
        return false;
      }
      
      console.log('Valid Groq API key found');
      setHasGroqKey(true);
      return true;
    } catch (err) {
      console.error('Error checking Groq API key:', err);
      setHasGroqKey(false);
      return false;
    } finally {
      setIsCheckingAdminKey(false);
    }
  }, []);
  
  const reloadApiKeys = useCallback(async () => {
    await checkGroqApiKey();
  }, [checkGroqApiKey]);
  
  return {
    hasGroqKey,
    checkGroqApiKey,
    isCheckingAdminKey,
    reloadApiKeys
  };
};
