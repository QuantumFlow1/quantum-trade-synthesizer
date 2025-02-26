
import { useState, useEffect } from 'react';
import { ApiKeySettings } from '../../types/GrokSettings';
import { toast } from '@/hooks/use-toast';

export function useApiKeys(initialApiKeys: ApiKeySettings, onApiKeysChange: (apiKeys: ApiKeySettings) => void) {
  const [openaiKey, setOpenaiKey] = useState(initialApiKeys.openaiApiKey || '');
  const [claudeKey, setClaudeKey] = useState(initialApiKeys.claudeApiKey || '');
  const [geminiKey, setGeminiKey] = useState(initialApiKeys.geminiApiKey || '');
  const [deepseekKey, setDeepseekKey] = useState(initialApiKeys.deepseekApiKey || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadApiKeys = () => {
      const savedOpenAIKey = localStorage.getItem('openaiApiKey');
      const savedClaudeKey = localStorage.getItem('claudeApiKey');
      const savedGeminiKey = localStorage.getItem('geminiApiKey');
      const savedDeepseekKey = localStorage.getItem('deepseekApiKey');
      
      console.log('Loading API keys from localStorage:', {
        openai: savedOpenAIKey ? 'present' : 'not found',
        claude: savedClaudeKey ? 'present' : 'not found',
        gemini: savedGeminiKey ? 'present' : 'not found',
        deepseek: savedDeepseekKey ? 'present' : 'not found'
      });
      
      const keysToUpdate: ApiKeySettings = { ...initialApiKeys };
      
      if (savedOpenAIKey) keysToUpdate.openaiApiKey = savedOpenAIKey;
      if (savedClaudeKey) keysToUpdate.claudeApiKey = savedClaudeKey;
      if (savedGeminiKey) keysToUpdate.geminiApiKey = savedGeminiKey;
      if (savedDeepseekKey) keysToUpdate.deepseekApiKey = savedDeepseekKey;
      
      setOpenaiKey(keysToUpdate.openaiApiKey || '');
      setClaudeKey(keysToUpdate.claudeApiKey || '');
      setGeminiKey(keysToUpdate.geminiApiKey || '');
      setDeepseekKey(keysToUpdate.deepseekApiKey || '');
      onApiKeysChange(keysToUpdate);
    };
    
    loadApiKeys();
  }, []);

  const handleSave = () => {
    const validateKey = (key: string, type: string): boolean => {
      if (!key) return true;
      
      if (type === 'openai' && !key.startsWith('sk-')) {
        toast({
          title: "Invalid OpenAI API Key",
          description: "OpenAI API keys should start with 'sk-'",
          variant: "destructive"
        });
        return false;
      }
      
      if (type === 'claude' && !key.startsWith('sk-ant-')) {
        toast({
          title: "Invalid Claude API Key",
          description: "Claude API keys should start with 'sk-ant-'",
          variant: "destructive"
        });
        return false;
      }
      
      if (type === 'gemini' && !key.startsWith('AIza')) {
        toast({
          title: "Invalid Gemini API Key",
          description: "Gemini API keys typically start with 'AIza'",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    };
    
    if (!validateKey(openaiKey, 'openai') ||
        !validateKey(claudeKey, 'claude') ||
        !validateKey(geminiKey, 'gemini')) {
      return;
    }
    
    const updatedKeys: ApiKeySettings = {
      openaiApiKey: openaiKey.trim(),
      claudeApiKey: claudeKey.trim(),
      geminiApiKey: geminiKey.trim(),
      deepseekApiKey: deepseekKey.trim()
    };
    
    if (updatedKeys.openaiApiKey) localStorage.setItem('openaiApiKey', updatedKeys.openaiApiKey);
    if (updatedKeys.claudeApiKey) localStorage.setItem('claudeApiKey', updatedKeys.claudeApiKey);
    if (updatedKeys.geminiApiKey) localStorage.setItem('geminiApiKey', updatedKeys.geminiApiKey);
    if (updatedKeys.deepseekApiKey) localStorage.setItem('deepseekApiKey', updatedKeys.deepseekApiKey);
    
    console.log('Saved API keys to localStorage:', {
      openai: updatedKeys.openaiApiKey ? 'present' : 'not set',
      claude: updatedKeys.claudeApiKey ? 'present' : 'not set',
      gemini: updatedKeys.geminiApiKey ? 'present' : 'not set',
      deepseek: updatedKeys.deepseekApiKey ? 'present' : 'not set'
    });
    
    onApiKeysChange(updatedKeys);
    setSaved(true);
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully",
      variant: "default"
    });
    
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return {
    openaiKey,
    setOpenaiKey,
    claudeKey,
    setClaudeKey,
    geminiKey,
    setGeminiKey,
    deepseekKey,
    setDeepseekKey,
    saved,
    handleSave
  };
}
