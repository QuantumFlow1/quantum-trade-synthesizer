import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { testOllamaConnection } from '@/utils/ollamaApiClient';

export function useLLMExtensions() {
  const [enabledLLMs, setEnabledLLMs] = useState<Record<string, boolean>>({
    deepseek: false,
    openai: false,
    grok: true,
    claude: false,
    ollama: true
  });

  const [activeTab, setActiveTab] = useState<string>('ollama');

  const [connectionStatus, setConnectionStatus] = useState<
    Record<string, 'connected' | 'disconnected' | 'unavailable' | 'checking'>
  >({
    deepseek: 'checking',
    openai: 'checking',
    grok: 'checking',
    claude: 'checking',
    ollama: 'checking'
  });

  const toggleLLM = useCallback((llm: string, enabled: boolean) => {
    setEnabledLLMs(prev => ({ ...prev, [llm]: enabled }));
    
    if (enabled) {
      setActiveTab(llm);
      checkConnectionStatusForLLM(llm);
    }
    
    toast({
      title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} ${enabled ? 'Enabled' : 'Disabled'}`,
      description: enabled 
        ? `${llm.charAt(0).toUpperCase() + llm.slice(1)} is now available` 
        : `${llm.charAt(0).toUpperCase() + llm.slice(1)} has been disabled`,
      duration: 3000,
    });
  }, []);

  const checkConnectionStatusForLLM = useCallback(async (llm: string) => {
    setConnectionStatus(prev => ({ ...prev, [llm]: 'checking' }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      let status: 'connected' | 'disconnected' | 'unavailable' = 'disconnected';
      
      switch (llm) {
        case 'ollama':
          const ollamaResult = await testOllamaConnection();
          status = ollamaResult.success ? 'connected' : 'unavailable';
          break;
          
        case 'deepseek':
          const deepseekKey = localStorage.getItem('deepseekApiKey');
          if (deepseekKey && deepseekKey.length > 10) {
            status = 'connected';
          }
          break;
          
        case 'openai':
          const openaiKey = localStorage.getItem('openaiApiKey');
          if (openaiKey && openaiKey.length > 10) {
            status = 'connected';
          }
          break;
          
        case 'grok':
          const grokKey = localStorage.getItem('groqApiKey');
          if (grokKey && grokKey.length > 10) {
            status = 'connected';
          }
          break;
          
        case 'claude':
          const claudeKey = localStorage.getItem('claudeApiKey');
          if (claudeKey && claudeKey.length > 10) {
            status = 'connected';
          }
          break;
          
        default:
          status = 'disconnected';
      }
      
      setConnectionStatus(prev => ({ ...prev, [llm]: status }));
      
      return status === 'connected';
    } catch (error) {
      console.error(`Error checking ${llm} connection:`, error);
      setConnectionStatus(prev => ({ ...prev, [llm]: 'unavailable' }));
      return false;
    }
  }, []);

  const configureApiKey = useCallback((llm: string) => {
    switch (llm) {
      case 'ollama':
        setActiveTab('ollama');
        break;
        
      case 'deepseek':
        window.location.href = '/dashboard/settings';
        break;
        
      case 'openai':
        window.location.href = '/dashboard/settings';
        break;
        
      case 'grok':
        window.location.href = '/dashboard/settings';
        break;
        
      case 'claude':
        window.location.href = '/dashboard/settings';
        break;
        
      default:
        toast({
          title: "Configuration Required",
          description: `Please set up your ${llm.charAt(0).toUpperCase() + llm.slice(1)} API key in settings.`,
          duration: 5000,
        });
    }
  }, []);

  useEffect(() => {
    Object.entries(enabledLLMs)
      .filter(([_, enabled]) => enabled)
      .forEach(([llm]) => {
        checkConnectionStatusForLLM(llm);
      });
  }, []);

  return {
    activeTab,
    setActiveTab,
    enabledLLMs,
    connectionStatus,
    toggleLLM,
    checkConnectionStatusForLLM,
    configureApiKey
  };
}
