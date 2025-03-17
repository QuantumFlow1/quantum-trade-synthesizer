
import { useState, useEffect, useCallback } from 'react';
import { testOllamaConnection } from '@/utils/ollamaApiClient';
import { toast } from '@/components/ui/use-toast';
import { testApiKeyConnection } from '@/utils/apiKeyManager';
import { testGroqApiConnection } from '@/utils/groqApiClient';

export function useLLMExtensions() {
  // Set default values for enabled LLMs
  const [enabledLLMs, setEnabledLLMs] = useState<Record<string, boolean>>(() => {
    try {
      // Try to load saved preferences
      const savedSettings = localStorage.getItem('enabledLLMs');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (e) {
      console.error('Error loading LLM preferences:', e);
    }
    // Default values if nothing is saved
    return {
      deepseek: false,
      openai: false,
      grok: true,     // Enable Groq by default
      claude: false,
      ollama: true    // Enable Ollama by default
    };
  });
  
  // Initialize with Groq as the active tab if enabled, otherwise use the first enabled LLM
  const [activeTab, setActiveTab] = useState(() => {
    if (enabledLLMs.grok) return 'grok';
    if (enabledLLMs.ollama) return 'ollama';
    // Find first enabled LLM
    const firstEnabled = Object.entries(enabledLLMs).find(([_, enabled]) => enabled);
    return firstEnabled ? firstEnabled[0] : 'ollama';
  });
  
  const [connectionStatus, setConnectionStatus] = useState<
    Record<string, 'connected' | 'disconnected' | 'unavailable' | 'checking'>
  >({
    deepseek: 'disconnected',
    openai: 'disconnected',
    grok: 'checking',    // Start checking Groq since it's enabled by default
    claude: 'disconnected',
    ollama: 'checking'   // Start checking Ollama since it's enabled by default
  });
  
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [currentLLM, setCurrentLLM] = useState<string | null>(null);
  
  // Save enabled LLMs to localStorage when changed
  useEffect(() => {
    localStorage.setItem('enabledLLMs', JSON.stringify(enabledLLMs));
  }, [enabledLLMs]);

  // Check API keys for all enabled LLMs on mount
  useEffect(() => {
    Object.entries(enabledLLMs).forEach(([llm, enabled]) => {
      if (enabled) {
        checkConnectionStatusForLLM(llm);
      }
    });
    
    // Listen for API key updates
    const handleApiKeyUpdate = (e: CustomEvent) => {
      console.log('API key updated, rechecking connections...', e.detail);
      if (e.detail?.type) {
        // Map the API key type to the corresponding LLM
        const llmMap: Record<string, string> = {
          groq: 'grok',
          openai: 'openai',
          claude: 'claude',
          anthropic: 'claude',
          deepseek: 'deepseek'
        };
        
        if (llmMap[e.detail.type]) {
          checkConnectionStatusForLLM(llmMap[e.detail.type]);
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
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate as EventListener);
      window.removeEventListener('localStorage-changed', handleApiKeyUpdate as EventListener);
    };
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
      
      toast({
        title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} Enabled`,
        description: `${llm.charAt(0).toUpperCase() + llm.slice(1)} is now available`,
        duration: 3000,
      });
    } else {
      toast({
        title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} Disabled`,
        description: `${llm.charAt(0).toUpperCase() + llm.slice(1)} has been disabled`,
        duration: 3000,
      });
    }
  }, []);
  
  const checkConnectionStatusForLLM = useCallback(async (llm: string) => {
    console.log(`Checking connection status for ${llm}...`);
    setConnectionStatus(prev => ({ ...prev, [llm]: 'checking' }));
    
    // Add some delay to show the checking state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      let status: 'connected' | 'disconnected' | 'unavailable' = 'disconnected';
      
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
  
  const configureApiKey = useCallback((llm: string) => {
    setCurrentLLM(llm);
    setIsApiKeyDialogOpen(true);
    
    // For Ollama, there's no API key to configure
    if (llm === 'ollama') {
      window.location.href = '/dashboard/settings';
    }
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
