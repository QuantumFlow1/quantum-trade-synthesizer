
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

  return {
    activeTab,
    setActiveTab,
    enabledLLMs,
    toggleLLM
  };
}
