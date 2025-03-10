
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { checkApiKeysAvailability } from '@/hooks/trading-chart/api-key-manager';

export const useLLMExtensions = () => {
  const [activeTab, setActiveTab] = useState('deepseek');
  const [enabledLLMs, setEnabledLLMs] = useState({
    deepseek: false,
    openai: false,
    grok: false,
    claude: false
  });

  const [connectionStatus, setConnectionStatus] = useState({
    deepseek: 'checking' as 'connected' | 'disconnected' | 'unavailable' | 'checking',
    openai: 'checking' as 'connected' | 'disconnected' | 'unavailable' | 'checking',
    grok: 'checking' as 'connected' | 'disconnected' | 'unavailable' | 'checking',
    claude: 'checking' as 'connected' | 'disconnected' | 'unavailable' | 'checking'
  });

  // Check connection status for an LLM
  const checkConnectionStatusForLLM = useCallback(async (llm: keyof typeof connectionStatus) => {
    console.log(`Checking connection status for ${llm}...`);
    
    let providerName: string;
    switch (llm) {
      case 'deepseek':
        providerName = 'deepseek';
        break;
      case 'openai':
        providerName = 'openai';
        break;
      case 'grok': // Grok uses Groq API
        providerName = 'groq';
        break;
      case 'claude':
        providerName = 'claude';
        break;
      default:
        providerName = llm;
    }
    
    setConnectionStatus(prev => ({
      ...prev,
      [llm]: 'checking'
    }));
    
    try {
      // Check both localStorage and admin-panel keys
      const storedKey = localStorage.getItem(`${providerName}ApiKey`);
      
      if (storedKey && storedKey.length > 5) {
        console.log(`Found localStorage key for ${providerName}`);
        setConnectionStatus(prev => ({
          ...prev,
          [llm]: 'connected'
        }));
        return;
      }
      
      // Check for admin-managed keys
      const { available } = await checkApiKeysAvailability(providerName as any);
      
      console.log(`${providerName} admin key available:`, available);
      setConnectionStatus(prev => ({
        ...prev,
        [llm]: available ? 'connected' : 'disconnected'
      }));
      
      // If key is available, enable the LLM
      if (available && !enabledLLMs[llm as keyof typeof enabledLLMs]) {
        setEnabledLLMs(prev => ({
          ...prev,
          [llm]: true
        }));
        
        // Show notification
        toast({
          title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} Available`,
          description: `${llm.charAt(0).toUpperCase() + llm.slice(1)} API is available and ready to use`,
          duration: 3000
        });
      }
    } catch (error) {
      console.error(`Error checking connection for ${llm}:`, error);
      setConnectionStatus(prev => ({
        ...prev,
        [llm]: 'unavailable'
      }));
    }
  }, [enabledLLMs]);

  // Initialize connection status on component mount
  useEffect(() => {
    const checkAllConnectionStatuses = async () => {
      await Promise.all([
        checkConnectionStatusForLLM('deepseek'),
        checkConnectionStatusForLLM('openai'),
        checkConnectionStatusForLLM('grok'),
        checkConnectionStatusForLLM('claude')
      ]);
    };

    checkAllConnectionStatuses();
    
    // Listen for API key status changes
    const handleConnectionStatusChange = (event: CustomEvent) => {
      const { provider, status } = event.detail;
      let llmName: string;
      
      // Map provider name to LLM name
      switch (provider) {
        case 'deepseek':
          llmName = 'deepseek';
          break;
        case 'openai':
          llmName = 'openai';
          break;
        case 'groq':
          llmName = 'grok'; // Groq API is used for Grok
          break;
        case 'claude':
          llmName = 'claude';
          break;
        default:
          return;
      }
      
      // Update connection status
      setConnectionStatus(prev => ({
        ...prev,
        [llmName]: status === 'connected' ? 'connected' : 'disconnected'
      }));
    };

    window.addEventListener('connection-status-changed', handleConnectionStatusChange as EventListener);
    window.addEventListener('apikey-updated', () => checkAllConnectionStatuses());
    window.addEventListener('localStorage-changed', () => checkAllConnectionStatuses());
    
    return () => {
      window.removeEventListener('connection-status-changed', handleConnectionStatusChange as EventListener);
      window.removeEventListener('apikey-updated', () => checkAllConnectionStatuses());
      window.removeEventListener('localStorage-changed', () => checkAllConnectionStatuses());
    };
  }, [checkConnectionStatusForLLM]);

  // Toggle LLM on/off
  const toggleLLM = (llm: string, enabled: boolean) => {
    console.log(`Toggling ${llm} to ${enabled}`);
    
    setEnabledLLMs(prev => ({
      ...prev,
      [llm]: enabled
    }));
    
    if (enabled && connectionStatus[llm as keyof typeof connectionStatus] !== 'connected') {
      checkConnectionStatusForLLM(llm as keyof typeof connectionStatus);
    }
  };

  // Configure API key (this now just checks for admin keys, doesn't show UI)
  const configureApiKey = async (llm: string) => {
    console.log(`Checking admin keys for ${llm}...`);
    
    let providerName: string;
    switch (llm) {
      case 'deepseek':
        providerName = 'deepseek';
        break;
      case 'openai':
        providerName = 'openai';
        break;
      case 'grok':
        providerName = 'groq';
        break;
      case 'claude':
        providerName = 'claude';
        break;
      default:
        providerName = llm;
    }
    
    try {
      // Check for admin-managed keys
      const { available } = await checkApiKeysAvailability(providerName as any);
      
      if (available) {
        toast({
          title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} API Key Available`,
          description: `Admin has configured the ${llm.charAt(0).toUpperCase() + llm.slice(1)} API key`,
          duration: 3000
        });
        
        // Update connection status
        setConnectionStatus(prev => ({
          ...prev,
          [llm]: 'connected'
        }));
        
        return;
      } else {
        toast({
          title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} API Key Unavailable`,
          description: `Please contact your administrator to enable ${llm.charAt(0).toUpperCase() + llm.slice(1)} API integration`,
          variant: 'destructive',
          duration: 5000
        });
      }
    } catch (error) {
      console.error(`Error checking admin keys for ${llm}:`, error);
      toast({
        title: "Error",
        description: `Unable to check API key status for ${llm}`,
        variant: 'destructive',
        duration: 3000
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    enabledLLMs,
    connectionStatus,
    toggleLLM,
    checkConnectionStatusForLLM,
    configureApiKey
  };
};
