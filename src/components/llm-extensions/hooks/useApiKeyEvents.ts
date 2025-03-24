
import { useEffect } from 'react';

export function useApiKeyEvents(
  enabledLLMs: Record<string, boolean>,
  checkConnectionStatusForLLM: (llm: string, enabled?: boolean) => Promise<boolean>
) {
  // Set up event listeners for API key updates
  useEffect(() => {
    const handleApiKeyUpdate = (e: CustomEvent) => {
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
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate as EventListener);
    window.addEventListener('localStorage-changed', handleApiKeyUpdate as EventListener);
    window.addEventListener('api-key-update', handleApiKeyUpdate as EventListener);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate as EventListener);
      window.removeEventListener('localStorage-changed', handleApiKeyUpdate as EventListener);
      window.removeEventListener('api-key-update', handleApiKeyUpdate as EventListener);
    };
  }, [enabledLLMs, checkConnectionStatusForLLM]);
}
