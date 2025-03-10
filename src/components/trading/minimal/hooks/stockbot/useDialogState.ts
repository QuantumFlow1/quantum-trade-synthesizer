
import { useState, useCallback, useEffect } from "react";
import { hasApiKey } from "@/utils/apiKeyManager";

/**
 * Hook for managing dialog state with API key health monitoring
 */
export const useDialogState = () => {
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [keyStatus, setKeyStatus] = useState<Record<string, boolean>>({});
  
  // Monitor API key health
  useEffect(() => {
    const checkKeys = () => {
      const status = {
        groq: hasApiKey('groq'),
        openai: hasApiKey('openai'),
        anthropic: hasApiKey('anthropic'),
        deepseek: hasApiKey('deepseek')
      };
      
      setKeyStatus(status);
      console.log('API key health status updated:', status);
    };
    
    // Initial check
    checkKeys();
    
    // Listen for API key changes
    const handleApiKeyChange = () => {
      console.log('API key change detected, updating health indicators');
      checkKeys();
    };
    
    window.addEventListener('apikey-updated', handleApiKeyChange);
    window.addEventListener('localStorage-changed', handleApiKeyChange);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyChange);
      window.removeEventListener('localStorage-changed', handleApiKeyChange);
    };
  }, []);
  
  const showApiKeyDialog = useCallback(() => {
    console.log('Opening API key dialog');
    setIsKeyDialogOpen(true);
  }, []);
  
  return {
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    showApiKeyDialog,
    keyStatus
  };
};
