
import { useState, useEffect, useCallback } from 'react';

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
    
    window.addEventListener('connection-status-changed', handleConnectionStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('connection-status-changed', handleConnectionStatusChange as EventListener);
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
  }, [activeTab, enabledLLMs]);

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
    
    // For Grok, we'll check availability from a different source
    // This would typically involve an API call to check service status
    const checkGrokAvailability = async () => {
      try {
        // This is a placeholder - in a real app, you'd make an API call here
        const isAvailable = true; // Mock response
        
        setConnectionStatus(prev => ({
          ...prev,
          grok: isAvailable ? 'connected' : 'unavailable'
        }));
      } catch (error) {
        console.error('Error checking Grok availability:', error);
        setConnectionStatus(prev => ({
          ...prev,
          grok: 'unavailable'
        }));
      }
    };
    
    checkGrokAvailability();
  }, []);

  return {
    activeTab,
    setActiveTab,
    enabledLLMs,
    connectionStatus,
    toggleLLM
  };
}
