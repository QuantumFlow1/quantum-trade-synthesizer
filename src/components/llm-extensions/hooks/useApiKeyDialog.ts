
import { useState, useCallback } from 'react';

/**
 * Hook for managing the API key dialog state
 */
export function useApiKeyDialog() {
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [currentLLM, setCurrentLLM] = useState<string | null>(null);
  
  const configureApiKey = useCallback((llm: string) => {
    setCurrentLLM(llm);
    setIsApiKeyDialogOpen(true);
    
    // For Ollama, there's no API key to configure
    if (llm === 'ollama') {
      window.location.href = '/dashboard/settings';
    }
  }, []);
  
  return {
    isApiKeyDialogOpen,
    currentLLM,
    configureApiKey,
    setIsApiKeyDialogOpen,
    setCurrentLLM
  };
}
