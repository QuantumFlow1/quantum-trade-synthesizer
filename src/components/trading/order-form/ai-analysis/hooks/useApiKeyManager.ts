
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export function useApiKeyManager() {
  const [showApiKeySheet, setShowApiKeySheet] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  // Check if any API keys are available in localStorage (for status display only)
  const checkLocalApiKeys = useCallback(() => {
    const openaiKey = localStorage.getItem('openaiApiKey');
    const claudeKey = localStorage.getItem('claudeApiKey');
    const geminiKey = localStorage.getItem('geminiApiKey');
    const deepseekKey = localStorage.getItem('deepseekApiKey');
    const groqKey = localStorage.getItem('groqApiKey');
    
    const hasAnyKey = !!(openaiKey || claudeKey || geminiKey || deepseekKey || groqKey);
    
    if (hasAnyKey) {
      setApiKeyStatus('available');
    } else {
      setApiKeyStatus('unavailable');
    }
    
    return hasAnyKey;
  }, []);

  // Initialize by checking for existing API keys
  useEffect(() => {
    checkLocalApiKeys();
  }, [checkLocalApiKeys]);

  const handleOpenApiKeySheet = useCallback(() => {
    setShowApiKeySheet(true);
  }, []);

  const handleCloseApiKeySheet = useCallback(() => {
    setShowApiKeySheet(false);
  }, []);

  return {
    showApiKeySheet,
    apiKeyStatus,
    handleOpenApiKeySheet,
    handleCloseApiKeySheet
  };
}
