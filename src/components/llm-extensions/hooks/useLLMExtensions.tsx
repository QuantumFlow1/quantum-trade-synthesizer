
import { useState, useEffect, useCallback } from 'react';
import { testOllamaConnection } from '@/utils/ollamaApiClient';
import { toast } from '@/components/ui/use-toast';
import { testApiKeyConnection } from '@/utils/apiKeyManager';
import { testGroqApiConnection } from '@/utils/groqApiClient';

export function useLLMExtensions() {
  const [activeTab, setActiveTab] = useState('ollama');
  const [enabledLLMs, setEnabledLLMs] = useState<Record<string, boolean>>({
    deepseek: false,
    openai: false,
    grok: false,
    claude: false,
    ollama: true,  // Enable Ollama by default
  });
  
  const [connectionStatus, setConnectionStatus] = useState<
    Record<string, 'connected' | 'disconnected' | 'unavailable' | 'checking'>
  >({
    deepseek: 'disconnected',
    openai: 'disconnected',
    grok: 'disconnected',
    claude: 'disconnected',
    ollama: 'checking',  // Start checking Ollama connection
  });
  
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [currentLLM, setCurrentLLM] = useState<string | null>(null);
  
  // Load enabled LLMs from localStorage
  useEffect(() => {
    const savedEnabledLLMs = localStorage.getItem('enabledLLMs');
    if (savedEnabledLLMs) {
      try {
        const parsed = JSON.parse(savedEnabledLLMs);
        setEnabledLLMs(parsed);
        
        // If we have any enabled LLMs, use the first one as the active tab
        const enabledKeys = Object.keys(parsed).filter(key => parsed[key]);
        if (enabledKeys.length > 0) {
          setActiveTab(enabledKeys[0]);
        }
      } catch (e) {
        console.error('Failed to parse enabled LLMs from localStorage', e);
      }
    }
    
    // Check API keys for all LLMs
    checkAllApiKeys();
    
    // Listen for API key updates
    const handleApiKeyUpdate = () => {
      console.log('API key updated, rechecking connections...');
      checkAllApiKeys();
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
    };
  }, []);
  
  // Check all API keys
  const checkAllApiKeys = useCallback(async () => {
    // Check OpenAI API key
    const openaiConnected = await testApiKeyConnection('openai');
    setConnectionStatus(prev => ({
      ...prev,
      openai: openaiConnected ? 'connected' : 'disconnected'
    }));
    
    // Check Claude API key
    const claudeConnected = await testApiKeyConnection('claude');
    setConnectionStatus(prev => ({
      ...prev,
      claude: claudeConnected ? 'connected' : 'disconnected'
    }));
    
    // Check DeepSeek API key
    const deepseekConnected = await testApiKeyConnection('deepseek');
    setConnectionStatus(prev => ({
      ...prev,
      deepseek: deepseekConnected ? 'connected' : 'disconnected'
    }));
    
    // Check Groq API key (using specific test function)
    const groqTest = await testGroqApiConnection();
    setConnectionStatus(prev => ({
      ...prev,
      grok: groqTest.success ? 'connected' : 'disconnected'
    }));
    
    // Check Ollama connection
    checkConnectionStatusForLLM('ollama');
  }, []);
  
  // Save enabled LLMs to localStorage when changed
  useEffect(() => {
    localStorage.setItem('enabledLLMs', JSON.stringify(enabledLLMs));
  }, [enabledLLMs]);
  
  const toggleLLM = useCallback((llm: string, enabled: boolean) => {
    setEnabledLLMs(prev => {
      const updated = { ...prev, [llm]: enabled };
      return updated;
    });
    
    if (enabled) {
      // Check connection when enabling
      checkConnectionStatusForLLM(llm);
      // Switch to the tab if enabling
      setActiveTab(llm);
    }
  }, []);
  
  const checkConnectionStatusForLLM = useCallback(async (llm: string) => {
    setConnectionStatus(prev => ({ ...prev, [llm]: 'checking' }));
    
    // Add some delay to show the checking state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      if (llm === 'ollama') {
        const ollamaStatus = await testOllamaConnection();
        console.log('Ollama connection status:', ollamaStatus);
        
        setConnectionStatus(prev => ({ 
          ...prev, 
          [llm]: ollamaStatus.success ? 'connected' : 'disconnected' 
        }));
        
        if (!ollamaStatus.success) {
          console.error('Ollama connection failed:', ollamaStatus.message);
        }
      } else if (llm === 'grok') {
        // Use the specific Groq test
        const groqTest = await testGroqApiConnection();
        setConnectionStatus(prev => ({ 
          ...prev, 
          [llm]: groqTest.success ? 'connected' : 'disconnected' 
        }));
        
        if (!groqTest.success) {
          console.error('Groq connection failed:', groqTest.message);
        }
      } else {
        // For other LLMs, use the generic API key test
        const connected = await testApiKeyConnection(llm as any);
        setConnectionStatus(prev => ({ 
          ...prev, 
          [llm]: connected ? 'connected' : 'disconnected' 
        }));
        
        if (!connected) {
          console.log(`${llm} API key not found or invalid`);
        }
      }
    } catch (error) {
      console.error(`Error checking connection for ${llm}:`, error);
      setConnectionStatus(prev => ({ ...prev, [llm]: 'disconnected' }));
    }
  }, []);
  
  const configureApiKey = useCallback((llm: string) => {
    setCurrentLLM(llm);
    setIsApiKeyDialogOpen(true);
  }, []);
  
  const closeApiKeyDialog = useCallback(() => {
    setIsApiKeyDialogOpen(false);
    // Re-check connection after closing dialog
    if (currentLLM) {
      checkConnectionStatusForLLM(currentLLM);
    }
  }, [currentLLM, checkConnectionStatusForLLM]);
  
  return {
    activeTab,
    setActiveTab,
    enabledLLMs,
    connectionStatus,
    toggleLLM,
    checkConnectionStatusForLLM,
    configureApiKey,
    isApiKeyDialogOpen,
    closeApiKeyDialog,
    currentLLM
  };
}
