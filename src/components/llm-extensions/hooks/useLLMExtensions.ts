
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface ConnectionStatus {
  deepseek: 'connected' | 'disconnected' | 'unavailable' | 'checking';
  openai: 'connected' | 'disconnected' | 'unavailable' | 'checking';
  grok: 'connected' | 'disconnected' | 'unavailable' | 'checking';
  claude: 'connected' | 'disconnected' | 'unavailable' | 'checking';
}

export function useLLMExtensions() {
  const [activeTab, setActiveTab] = useState('deepseek');
  const [enabledLLMs, setEnabledLLMs] = useState<Record<string, boolean>>({
    deepseek: false,
    openai: false,
    grok: false,
    claude: false
  });
  
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    deepseek: 'checking',
    openai: 'checking',
    grok: 'checking',
    claude: 'checking'
  });

  // Load enabled LLMs from localStorage
  useEffect(() => {
    const savedEnabledLLMs = localStorage.getItem('enabledLLMs');
    if (savedEnabledLLMs) {
      try {
        const parsed = JSON.parse(savedEnabledLLMs);
        setEnabledLLMs(parsed);
        
        // Set active tab to the first enabled LLM, if any
        const enabledLLM = Object.keys(parsed).find(llm => parsed[llm]);
        if (enabledLLM) {
          setActiveTab(enabledLLM);
        }
      } catch (error) {
        console.error('Error loading enabled LLMs:', error);
      }
    }
    
    // Check connection status for each LLM
    checkConnectionStatus();
    
    // Listen for connection status changes
    const handleConnectionStatusChange = (event: CustomEvent) => {
      const { provider, status } = event.detail;
      
      setConnectionStatus(prev => ({
        ...prev,
        [provider]: status
      }));
    };
    
    // Listen for API key changes in localStorage
    const handleApiKeyChange = () => {
      checkConnectionStatus();
    };
    
    window.addEventListener('connection-status-changed', handleConnectionStatusChange as EventListener);
    window.addEventListener('storage', handleApiKeyChange);
    window.addEventListener('apikey-updated', handleApiKeyChange);
    
    return () => {
      window.removeEventListener('connection-status-changed', handleConnectionStatusChange as EventListener);
      window.removeEventListener('storage', handleApiKeyChange);
      window.removeEventListener('apikey-updated', handleApiKeyChange);
    };
  }, []);

  // Save enabled LLMs to localStorage when they change
  useEffect(() => {
    localStorage.setItem('enabledLLMs', JSON.stringify(enabledLLMs));
  }, [enabledLLMs]);

  // Toggle LLM enabled state
  const toggleLLM = useCallback((llm: string, enabled: boolean) => {
    setEnabledLLMs(prev => ({
      ...prev,
      [llm]: enabled
    }));
    
    // If enabling an LLM, make it the active tab
    if (enabled) {
      setActiveTab(llm);
    } else if (activeTab === llm) {
      // If disabling the active tab, find another enabled one to switch to
      const nextEnabledLLM = Object.keys(enabledLLMs).find(key => key !== llm && enabledLLMs[key]);
      if (nextEnabledLLM) {
        setActiveTab(nextEnabledLLM);
      }
    }
    
    // If enabling an LLM and its status is still checking, verify its connection
    if (enabled && connectionStatus[llm as keyof ConnectionStatus] === 'checking') {
      checkConnectionStatusForLLM(llm as keyof ConnectionStatus);
    }
  }, [activeTab, enabledLLMs, connectionStatus]);

  // Check connection status for a specific LLM
  const checkConnectionStatusForLLM = useCallback(async (llm: keyof ConnectionStatus) => {
    setConnectionStatus(prev => ({
      ...prev,
      [llm]: 'checking'
    }));
    
    // First check if API key exists in localStorage
    const apiKey = localStorage.getItem(`${llm}ApiKey`);
    if (!apiKey) {
      setConnectionStatus(prev => ({
        ...prev,
        [llm]: 'disconnected'
      }));
      return;
    }
    
    try {
      // Use the Supabase Edge Function to verify the connection
      const { data, error } = await supabase.functions.invoke('check-api-keys', {
        body: { service: llm, checkSecret: true }
      });
      
      if (error) {
        console.error(`Error checking ${llm} connection:`, error);
        setConnectionStatus(prev => ({
          ...prev,
          [llm]: 'unavailable'
        }));
        return;
      }
      
      // Check if the API key is valid
      if (data?.secretSet) {
        setConnectionStatus(prev => ({
          ...prev,
          [llm]: 'connected'
        }));
        
        // Display a toast notification
        toast({
          title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} Connected`,
          description: `Successfully connected to ${llm.charAt(0).toUpperCase() + llm.slice(1)} API.`
        });
      } else {
        setConnectionStatus(prev => ({
          ...prev,
          [llm]: 'disconnected'
        }));
      }
    } catch (error) {
      console.error(`Error in ${llm} connection check:`, error);
      setConnectionStatus(prev => ({
        ...prev,
        [llm]: 'unavailable'
      }));
    }
  }, []);

  // Check connection status for all LLMs
  const checkConnectionStatus = useCallback(() => {
    // Check if API keys exist in localStorage
    const deepseekKey = localStorage.getItem('deepseekApiKey');
    const openaiKey = localStorage.getItem('openaiApiKey');
    const claudeKey = localStorage.getItem('claudeApiKey');
    
    // Update connection status based on API key presence
    setConnectionStatus(prev => ({
      ...prev,
      deepseek: deepseekKey ? 'connected' : 'disconnected',
      openai: openaiKey ? 'connected' : 'disconnected',
      claude: claudeKey ? 'connected' : 'disconnected',
      // For Grok, we need to do an additional check with the backend
      grok: prev.grok === 'checking' ? 'checking' : prev.grok
    }));
    
    // For Grok, check availability from a different source
    checkGrokAvailability();
    
    // For models with API keys, verify the connection works
    if (deepseekKey) checkConnectionStatusForLLM('deepseek');
    if (openaiKey) checkConnectionStatusForLLM('openai');
    if (claudeKey) checkConnectionStatusForLLM('claude');
  }, [checkConnectionStatusForLLM]);
  
  // Specifically check Grok availability
  const checkGrokAvailability = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('grok3-ping', {
        body: { isAvailabilityCheck: true }
      });
      
      if (error) {
        console.error('Error checking Grok availability:', error);
        setConnectionStatus(prev => ({
          ...prev,
          grok: 'unavailable'
        }));
        return;
      }
      
      const isAvailable = data?.status === 'available';
      setConnectionStatus(prev => ({
        ...prev,
        grok: isAvailable ? 'connected' : 'unavailable'
      }));
    } catch (error) {
      console.error('Exception checking Grok availability:', error);
      setConnectionStatus(prev => ({
        ...prev,
        grok: 'unavailable'
      }));
    }
  }, []);

  return {
    activeTab,
    setActiveTab,
    enabledLLMs,
    connectionStatus,
    toggleLLM,
    checkConnectionStatus,
    checkConnectionStatusForLLM
  };
}
