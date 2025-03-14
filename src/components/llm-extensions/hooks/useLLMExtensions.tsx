
import { useState, useEffect, useCallback } from 'react';
import { testOllamaConnection } from '@/utils/ollamaApiClient';
import { toast } from '@/components/ui/use-toast';
import { ApiKeyDialogContent } from '@/components/chat/api-keys/ApiKeyDialogContent';
import { Dialog } from '@/components/ui/dialog';

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
      } catch (e) {
        console.error('Failed to parse enabled LLMs from localStorage', e);
      }
    }
    
    // Check connection status for all enabled LLMs
    Object.entries(enabledLLMs).forEach(([llm, enabled]) => {
      if (enabled) {
        checkConnectionStatusForLLM(llm);
      }
    });
  }, []);
  
  // Save enabled LLMs to localStorage when changed
  useEffect(() => {
    localStorage.setItem('enabledLLMs', JSON.stringify(enabledLLMs));
  }, [enabledLLMs]);
  
  // Check Ollama connection on initial load
  useEffect(() => {
    if (enabledLLMs.ollama) {
      checkConnectionStatusForLLM('ollama');
    }
  }, []);
  
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
        setConnectionStatus(prev => ({ 
          ...prev, 
          [llm]: ollamaStatus.success ? 'connected' : 'disconnected' 
        }));
        
        if (!ollamaStatus.success) {
          toast({
            title: "Ollama Connection Failed",
            description: ollamaStatus.message,
            variant: "destructive",
          });
        }
      } else {
        // For other LLMs, we'd need to add API key checking logic here
        // For now, mark them as disconnected
        setConnectionStatus(prev => ({ ...prev, [llm]: 'disconnected' }));
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
