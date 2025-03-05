
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export function useApiKeyManager() {
  const [showApiKeySheet, setShowApiKeySheet] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  // Check if any API keys are available in localStorage
  const checkLocalApiKeys = useCallback(() => {
    const openaiKey = localStorage.getItem('openaiApiKey');
    const claudeKey = localStorage.getItem('claudeApiKey');
    const geminiKey = localStorage.getItem('geminiApiKey');
    const deepseekKey = localStorage.getItem('deepseekApiKey');
    
    const hasAnyKey = !!(openaiKey || claudeKey || geminiKey || deepseekKey);
    
    if (hasAnyKey) {
      setApiKeyStatus('available');
    } else {
      setApiKeyStatus('unavailable');
    }
    
    return hasAnyKey;
  }, []);

  // Initialize by checking for existing API keys
  useState(() => {
    checkLocalApiKeys();
  });

  const handleOpenApiKeySheet = useCallback(() => {
    setShowApiKeySheet(true);
  }, []);

  const handleCloseApiKeySheet = useCallback(() => {
    setShowApiKeySheet(false);
  }, []);

  const saveApiKeys = useCallback((keys: { openai: string; claude: string; gemini: string; deepseek: string }) => {
    const { openai, claude, gemini, deepseek } = keys;
    
    // Save keys to localStorage
    if (openai) localStorage.setItem('openaiApiKey', openai);
    if (claude) localStorage.setItem('claudeApiKey', claude);
    if (gemini) localStorage.setItem('geminiApiKey', gemini);
    if (deepseek) localStorage.setItem('deepseekApiKey', deepseek);
    
    const hasAnyKey = !!(openai || claude || gemini || deepseek);
    
    if (hasAnyKey) {
      setApiKeyStatus('available');
      toast({
        title: "API keys saved",
        description: "Your API keys have been saved successfully.",
        duration: 3000,
      });
    } else {
      setApiKeyStatus('unavailable');
    }
    
    return hasAnyKey;
  }, []);

  return {
    showApiKeySheet,
    apiKeyStatus,
    handleOpenApiKeySheet,
    handleCloseApiKeySheet,
    saveApiKeys
  };
}
