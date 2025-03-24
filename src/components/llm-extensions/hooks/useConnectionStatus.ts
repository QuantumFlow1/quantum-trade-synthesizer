
import { useState, useCallback } from 'react';
import { testOllamaConnection } from '@/utils/ollamaApiClient';
import { testApiKeyConnection } from '@/utils/apiKeyManager';
import { testGroqApiConnection } from '@/utils/groqApiClient';
import { supabase } from '@/lib/supabase';

type ConnectionStatus = 'connected' | 'disconnected' | 'unavailable' | 'checking';

interface ConnectionDetails {
  status: ConnectionStatus;
  supportsMCP?: boolean;
}

/**
 * Hook for managing connection status of LLM extensions
 */
export function useConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<Record<string, ConnectionDetails>>({
    deepseek: { status: 'disconnected' },
    openai: { status: 'disconnected' },
    grok: { status: 'checking' },
    claude: { status: 'disconnected' },
    ollama: { status: 'checking' }
  });

  const checkConnectionStatusForLLM = useCallback(async (llm: string, isEnabled?: boolean, checkMCP = false) => {
    console.log(`Checking connection status for ${llm}...`);
    
    // If explicitly told the LLM is disabled, mark it as disconnected
    if (isEnabled === false) {
      console.log(`${llm} is disabled, setting connection status to disconnected`);
      setConnectionStatus(prev => ({ 
        ...prev, 
        [llm]: { status: 'disconnected' } 
      }));
      return false;
    }
    
    setConnectionStatus(prev => ({ 
      ...prev, 
      [llm]: { ...prev[llm], status: 'checking' } 
    }));
    
    // Add some delay to show the checking state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      let connectionDetails: ConnectionDetails = { status: 'disconnected' };
      
      switch (llm) {
        case 'ollama':
          const ollamaResult = await testOllamaConnection();
          console.log('Ollama connection test result:', ollamaResult);
          connectionDetails = { 
            status: ollamaResult.success ? 'connected' : 'unavailable'
          };
          break;
          
        case 'grok':
          // Use the specific Groq test function
          const groqResult = await testGroqApiConnection();
          console.log('Groq connection test result:', groqResult);
          connectionDetails = { 
            status: groqResult.success ? 'connected' : 'disconnected'
          };
          break;
        
        case 'claude':
          // Check the API key and MCP support for Claude
          const apiKey = localStorage.getItem('claudeApiKey');
          if (apiKey) {
            try {
              const { data, error } = await supabase.functions.invoke('claude-ping', {
                body: { apiKey, checkMCP }
              });
              
              if (!error && data.status === 'available') {
                connectionDetails = {
                  status: 'connected',
                  supportsMCP: data.mcpSupported
                };
              } else {
                connectionDetails = { status: 'disconnected' };
              }
            } catch (err) {
              console.error('Error checking Claude connection:', err);
              connectionDetails = { status: 'unavailable' };
            }
          } else {
            connectionDetails = { status: 'disconnected' };
          }
          break;
         
        case 'openai':
          // Check the API key and MCP support for OpenAI
          const openaiKey = localStorage.getItem('openaiApiKey');
          if (openaiKey) {
            try {
              const { data, error } = await supabase.functions.invoke('openai-ping', {
                body: { apiKey: openaiKey, checkMCP }
              });
              
              if (!error && data.status === 'available') {
                connectionDetails = {
                  status: 'connected',
                  supportsMCP: data.mcpSupported
                };
              } else {
                connectionDetails = { status: 'disconnected' };
              }
            } catch (err) {
              console.error('Error checking OpenAI connection:', err);
              connectionDetails = { status: 'unavailable' };
            }
          } else {
            connectionDetails = { status: 'disconnected' };
          }
          break;
          
        default:
          // For other LLMs, use the generic API key test
          const apiKeyExists = await testApiKeyConnection(llm as any);
          console.log(`${llm} API key exists:`, apiKeyExists);
          connectionDetails = { 
            status: apiKeyExists ? 'connected' : 'disconnected'
          };
          break;
      }
      
      console.log(`Setting ${llm} connection status to`, connectionDetails);
      setConnectionStatus(prev => ({ ...prev, [llm]: connectionDetails }));
      return connectionDetails.status === 'connected';
    } catch (error) {
      console.error(`Error checking connection for ${llm}:`, error);
      setConnectionStatus(prev => ({ 
        ...prev, 
        [llm]: { status: 'unavailable' }
      }));
      return false;
    }
  }, []);

  return {
    connectionStatus,
    setConnectionStatus,
    checkConnectionStatusForLLM
  };
}
