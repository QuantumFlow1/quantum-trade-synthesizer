
import { ApiKeySettings, ModelInfo } from '../types/GrokSettings';
import { toast } from '@/hooks/use-toast';

/**
 * Validates an API key based on its type
 */
export const validateApiKey = (key: string, type: string): boolean => {
  if (!key) return true; // Empty key is valid (just not set)
  
  // Check if key has proper format based on provider
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
  
  if (type === 'groq' && !key.startsWith('gsk_')) {
    toast({
      title: "Invalid Groq API Key",
      description: "Groq API keys typically start with 'gsk_'",
      variant: "destructive"
    });
    return false;
  }
  
  return true;
};

/**
 * Saves API keys to localStorage and returns updated ApiKeySettings
 */
export const saveApiKeys = (
  openaiKey: string, 
  claudeKey: string, 
  geminiKey: string, 
  deepseekKey: string,
  groqKey: string
): ApiKeySettings => {
  const updatedKeys: ApiKeySettings = {
    openaiApiKey: openaiKey.trim(),
    claudeApiKey: claudeKey.trim(),
    geminiApiKey: geminiKey.trim(),
    deepseekApiKey: deepseekKey.trim(),
    groqApiKey: groqKey.trim()
  };
  
  // Save to localStorage
  if (updatedKeys.openaiApiKey) localStorage.setItem('openaiApiKey', updatedKeys.openaiApiKey);
  if (updatedKeys.claudeApiKey) localStorage.setItem('claudeApiKey', updatedKeys.claudeApiKey);
  if (updatedKeys.geminiApiKey) localStorage.setItem('geminiApiKey', updatedKeys.geminiApiKey);
  if (updatedKeys.deepseekApiKey) localStorage.setItem('deepseekApiKey', updatedKeys.deepseekApiKey);
  if (updatedKeys.groqApiKey) localStorage.setItem('groqApiKey', updatedKeys.groqApiKey);
  
  console.log('Saved API keys to localStorage:', {
    openai: updatedKeys.openaiApiKey ? 'present' : 'not set',
    claude: updatedKeys.claudeApiKey ? 'present' : 'not set',
    gemini: updatedKeys.geminiApiKey ? 'present' : 'not set',
    deepseek: updatedKeys.deepseekApiKey ? 'present' : 'not set',
    groq: updatedKeys.groqApiKey ? 'present' : 'not set'
  });
  
  // Dispatch a custom event to notify other components that the API key has been updated
  const event = new Event('apikey-updated');
  window.dispatchEvent(event);
  
  // Show toast notification
  if (updatedKeys.groqApiKey) {
    toast({
      title: "Groq API Key Saved",
      description: "Your Groq API key has been saved and will be used for AI-powered features.",
      duration: 3000
    });
  }
  
  return updatedKeys;
};

/**
 * Checks if the current model has a required API key set
 */
export const hasCurrentModelKey = (
  selectedModel: ModelInfo | undefined,
  apiKeys: ApiKeySettings
): boolean => {
  if (!selectedModel) return false;
  
  switch (selectedModel.id) {
    case 'openai':
    case 'gpt-4':
    case 'gpt-3.5-turbo':
      return !!apiKeys.openaiApiKey;
    case 'claude':
    case 'claude-3-haiku':
    case 'claude-3-sonnet':
    case 'claude-3-opus':
      return !!apiKeys.claudeApiKey;
    case 'gemini':
    case 'gemini-pro':
      return !!apiKeys.geminiApiKey;
    case 'deepseek':
    case 'deepseek-chat':
      return !!apiKeys.deepseekApiKey;
    case 'groq':
      return !!apiKeys.groqApiKey;
    default:
      return true;
  }
};

/**
 * Loads API keys from localStorage
 */
export const loadApiKeysFromStorage = (): ApiKeySettings => {
  const savedOpenAIKey = localStorage.getItem('openaiApiKey') || '';
  const savedClaudeKey = localStorage.getItem('claudeApiKey') || '';
  const savedGeminiKey = localStorage.getItem('geminiApiKey') || '';
  const savedDeepseekKey = localStorage.getItem('deepseekApiKey') || '';
  const savedGroqKey = localStorage.getItem('groqApiKey') || '';
  
  return {
    openaiApiKey: savedOpenAIKey,
    claudeApiKey: savedClaudeKey,
    geminiApiKey: savedGeminiKey,
    deepseekApiKey: savedDeepseekKey,
    groqApiKey: savedGroqKey
  };
};
