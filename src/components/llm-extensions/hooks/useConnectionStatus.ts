
import { useState, useCallback } from 'react';
import { testOllamaConnection } from '@/utils/ollamaApiClient';
import { testApiKeyConnection } from '@/utils/apiKeyManager';
import { testGroqApiConnection } from '@/utils/groqApiClient';

type ConnectionStatus = 'connected' | 'disconnected' | 'unavailable' | 'checking';

/**
 * Hook for managing connection status of LLM extensions
 */
export function useConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<Record<string, ConnectionStatus>>({
    deepseek: 'disconnected',
    openai: 'disconnected',
    grok: 'checking',
    claude: 'disconnected',
    ollama: 'checking'
  });

  const checkConnectionStatusForLLM = useCallback(async (llm: string) => {
    console.log(`Checking connection status for ${llm}...`);
    setConnectionStatus(prev => ({ ...prev, [llm]: 'checking' }));
    
    // Add some delay to show the checking state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      let status: ConnectionStatus = 'disconnected';
      
      switch (llm) {
        case 'ollama':
          const ollamaResult = await testOllamaConnection();
          console.log('Ollama connection test result:', ollamaResult);
          status = ollamaResult.success ? 'connected' : 'unavailable';
          break;
          
        case 'grok':
          // Use the specific Groq test function
          const groqResult = await testGroqApiConnection();
          console.log('Groq connection test result:', groqResult);
          status = groqResult.success ? 'connected' : 'disconnected';
          break;
          
        default:
          // For other LLMs, use the generic API key test
          const apiKeyExists = await testApiKeyConnection(llm as any);
          console.log(`${llm} API key exists:`, apiKeyExists);
          status = apiKeyExists ? 'connected' : 'disconnected';
          break;
      }
      
      console.log(`Setting ${llm} connection status to ${status}`);
      setConnectionStatus(prev => ({ ...prev, [llm]: status }));
      return status === 'connected';
    } catch (error) {
      console.error(`Error checking connection for ${llm}:`, error);
      setConnectionStatus(prev => ({ ...prev, [llm]: 'unavailable' }));
      return false;
    }
  }, []);

  return {
    connectionStatus,
    setConnectionStatus,
    checkConnectionStatusForLLM
  };
}
