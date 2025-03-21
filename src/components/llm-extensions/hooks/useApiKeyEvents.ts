
import { useEffect, useCallback } from 'react';

/**
 * Hook for handling API key update events
 */
export function useApiKeyEvents(
  enabledLLMs: Record<string, boolean>,
  checkConnectionStatusForLLM: (llm: string) => Promise<boolean>
) {
  // Handle API key updates from events
  const handleApiKeyUpdate = useCallback((e: CustomEvent) => {
    console.log('API key updated, rechecking connections...', e.detail);
    if (e.detail?.keyType) {
      // Map the API key type to the corresponding LLM
      const llmMap: Record<string, string> = {
        groq: 'grok',
        openai: 'openai',
        claude: 'claude',
        anthropic: 'claude',
        deepseek: 'deepseek'
      };
      
      if (llmMap[e.detail.keyType]) {
        checkConnectionStatusForLLM(llmMap[e.detail.keyType]);
      }
    } else {
      // If no specific type, check all enabled LLMs
      Object.entries(enabledLLMs)
        .filter(([_, enabled]) => enabled)
        .forEach(([llm]) => {
          checkConnectionStatusForLLM(llm);
        });
    }
  }, [enabledLLMs, checkConnectionStatusForLLM]);

  // Setup event listeners for API key updates
  useEffect(() => {
    // Check API keys for all enabled LLMs on mount
    Object.entries(enabledLLMs).forEach(([llm, enabled]) => {
      if (enabled) {
        checkConnectionStatusForLLM(llm);
      }
    });
    
    // Listen for API key updates
    window.addEventListener('apikey-updated', handleApiKeyUpdate as EventListener);
    window.addEventListener('localStorage-changed', handleApiKeyUpdate as EventListener);
    window.addEventListener('api-key-update', handleApiKeyUpdate as EventListener);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate as EventListener);
      window.removeEventListener('localStorage-changed', handleApiKeyUpdate as EventListener);
      window.removeEventListener('api-key-update', handleApiKeyUpdate as EventListener);
    };
  }, [enabledLLMs, handleApiKeyUpdate, checkConnectionStatusForLLM]);

  return { handleApiKeyUpdate };
}
