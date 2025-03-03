
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export function useLLMExtensions() {
  const [activeTab, setActiveTab] = useState('deepseek');
  const [enabledLLMs, setEnabledLLMs] = useState({
    deepseek: true,
    openai: true,
    grok: true,
    claude: true
  });
  
  // Connection status tracking for each LLM
  const [connectionStatus, setConnectionStatus] = useState({
    deepseek: 'disconnected',
    openai: 'disconnected',
    grok: 'disconnected',
    claude: 'disconnected'
  } as Record<string, 'connected' | 'connecting' | 'disconnected' | 'error'>);
  
  // Load enabled states from localStorage on mount
  useEffect(() => {
    const savedStates = localStorage.getItem('enabledLLMs');
    if (savedStates) {
      try {
        setEnabledLLMs(JSON.parse(savedStates));
      } catch (e) {
        console.error('Error parsing saved LLM states:', e);
      }
    }
    
    // Check for API keys to determine connection status
    const deepseekKey = localStorage.getItem('deepseekApiKey');
    const openaiKey = localStorage.getItem('openaiApiKey');
    const claudeKey = localStorage.getItem('claudeApiKey');
    
    // Update connection status based on available keys
    setConnectionStatus(prev => ({
      ...prev,
      deepseek: deepseekKey ? 'connected' : 'disconnected',
      openai: openaiKey ? 'connected' : 'disconnected',
      claude: claudeKey ? 'connected' : 'disconnected',
      // Grok doesn't need an API key
      grok: 'connected'
    }));
  }, []);
  
  // Listen for API key updates
  useEffect(() => {
    const handleApiKeyUpdate = () => {
      // Check for API keys to determine connection status
      const deepseekKey = localStorage.getItem('deepseekApiKey');
      const openaiKey = localStorage.getItem('openaiApiKey');
      const claudeKey = localStorage.getItem('claudeApiKey');
      
      // Update connection status based on available keys
      setConnectionStatus(prev => ({
        ...prev,
        deepseek: deepseekKey ? 'connected' : 'disconnected',
        openai: openaiKey ? 'connected' : 'disconnected',
        claude: claudeKey ? 'connected' : 'disconnected'
      }));
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
    };
  }, []);
  
  // Save enabled states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('enabledLLMs', JSON.stringify(enabledLLMs));
  }, [enabledLLMs]);
  
  const toggleLLM = (llm: 'deepseek' | 'openai' | 'grok' | 'claude') => {
    setEnabledLLMs(prev => {
      const newState = { ...prev, [llm]: !prev[llm] };
      
      // Show toast notification
      toast({
        title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} ${newState[llm] ? 'Enabled' : 'Disabled'}`,
        description: newState[llm] 
          ? `${llm.charAt(0).toUpperCase() + llm.slice(1)} is now ready to use.` 
          : `${llm.charAt(0).toUpperCase() + llm.slice(1)} has been turned off.`,
        duration: 3000
      });
      
      return newState;
    });
  };
  
  // Update connection status for a specific LLM
  const updateConnectionStatus = (
    llm: 'deepseek' | 'openai' | 'grok' | 'claude', 
    status: 'connected' | 'connecting' | 'disconnected' | 'error'
  ) => {
    setConnectionStatus(prev => ({
      ...prev,
      [llm]: status
    }));
  };

  return {
    activeTab,
    setActiveTab,
    enabledLLMs,
    connectionStatus,
    toggleLLM,
    updateConnectionStatus
  };
}
