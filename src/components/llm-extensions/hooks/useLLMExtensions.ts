
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { fetchAdminApiKey } from '@/components/chat/services/utils/apiHelpers';

type ConnectionStatus = 'connected' | 'disconnected' | 'unavailable' | 'checking';

export function useLLMExtensions() {
  const [activeTab, setActiveTab] = useState('deepseek');
  const [enabledLLMs, setEnabledLLMs] = useState({
    deepseek: true,
    openai: true,
    grok: true,
    claude: true
  });
  
  const [connectionStatus, setConnectionStatus] = useState<Record<string, ConnectionStatus>>({
    deepseek: 'checking',
    openai: 'checking',
    grok: 'checking',
    claude: 'checking'
  });

  // Check connection status for all LLMs on mount
  useEffect(() => {
    checkConnectionStatusForAll();
    
    // Set up event listeners for API key changes
    const handleStorageChange = () => {
      console.log('API key storage change detected, rechecking LLM connection status');
      checkConnectionStatusForAll();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('apikey-updated', handleStorageChange);
    window.addEventListener('localStorage-changed', handleStorageChange);
    
    // Subscription for connection status changes from child components
    const handleConnectionStatusChange = (event: CustomEvent) => {
      const { provider, status } = event.detail;
      setConnectionStatus(prev => ({
        ...prev,
        [provider]: status
      }));
    };
    
    window.addEventListener('connection-status-changed', handleConnectionStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('apikey-updated', handleStorageChange);
      window.removeEventListener('localStorage-changed', handleStorageChange);
      window.removeEventListener('connection-status-changed', handleConnectionStatusChange as EventListener);
    };
  }, []);

  const checkConnectionStatusForAll = useCallback(async () => {
    // Check all LLMs in parallel
    await Promise.all([
      checkConnectionStatusForLLM('deepseek'),
      checkConnectionStatusForLLM('openai'),
      checkConnectionStatusForLLM('grok'),
      checkConnectionStatusForLLM('claude')
    ]);
  }, []);

  const checkConnectionStatusForLLM = useCallback(async (llm: string) => {
    console.log(`Checking connection status for ${llm}...`);
    
    setConnectionStatus(prev => ({
      ...prev,
      [llm]: 'checking'
    }));
    
    // Special handling for grok which uses groq key
    if (llm === 'grok') {
      const groqKey = localStorage.getItem('groqApiKey');
      if (groqKey && groqKey.length > 10) {
        console.log('Found localStorage key for groq');
        setConnectionStatus(prev => ({
          ...prev,
          [llm]: 'connected'
        }));
        return;
      }
    }
    
    // Check localStorage for user API key
    const localStorageKey = localStorage.getItem(`${llm === 'grok' ? 'groq' : llm}ApiKey`);
    if (localStorageKey && localStorageKey.length > 10) {
      console.log(`Found valid localStorage key for ${llm}`);
      setConnectionStatus(prev => ({
        ...prev,
        [llm]: 'connected'
      }));
      return;
    }
    
    // If no key in localStorage, check for admin API key
    try {
      console.log(`Checking API availability for ${llm}`);
      
      // Check the admin API key for this provider
      const provider = llm === 'grok' ? 'groq' : llm;
      const adminKey = await fetchAdminApiKey(provider as any);
      
      // Log whether the admin key is available (securely)
      console.log(`${provider} admin key available: ${!!adminKey}`);
      
      if (adminKey) {
        // Admin key is available, so connection is possible
        setConnectionStatus(prev => ({
          ...prev,
          [llm]: 'connected'
        }));
      } else {
        // Admin key not available, connection not possible
        setConnectionStatus(prev => ({
          ...prev,
          [llm]: 'unavailable'
        }));
      }
    } catch (error) {
      console.error(`Error checking admin key for ${llm}:`, error);
      setConnectionStatus(prev => ({
        ...prev,
        [llm]: 'unavailable'
      }));
    }
  }, []);

  const toggleLLM = useCallback((llm: string, enabled: boolean) => {
    setEnabledLLMs(prev => ({
      ...prev,
      [llm]: enabled
    }));
    
    if (enabled) {
      // If enabling, check connection status
      checkConnectionStatusForLLM(llm);
    }
    
    toast({
      title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `The ${llm} extension has been ${enabled ? 'enabled' : 'disabled'}.`,
      duration: 3000
    });
  }, [checkConnectionStatusForLLM]);

  const configureApiKey = useCallback((llm: string) => {
    // Redirect to the settings page
    window.location.href = '/dashboard/settings';
  }, []);

  return {
    activeTab,
    setActiveTab,
    enabledLLMs,
    toggleLLM,
    connectionStatus,
    checkConnectionStatusForLLM,
    configureApiKey
  };
}
