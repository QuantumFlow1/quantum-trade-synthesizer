import { ApiKeySettings, ModelInfo } from '../types/GrokSettings';
import { 
  showApiKeyInfoToast,
  showApiKeySavedToast, 
  showApiKeyErrorToast, 
  showAllApiKeysRefreshedToast
} from './ApiKeyToastNotification';
import { toast } from '@/hooks/use-toast';

/**
 * Validates an API key based on its type
 */
export const validateApiKey = (key: string, type: string): boolean => {
  if (!key) return true; // Empty key is valid (just not set)
  
  // Check if key has proper format based on provider
  if (type === 'openai' && !key.startsWith('sk-')) {
    toast({
      title: "OpenAI API Key Invalid",
      description: "OpenAI API keys should start with 'sk-'",
      variant: "destructive"
    });
    return false;
  }
  
  if (type === 'claude' && !key.startsWith('sk-ant-')) {
    toast({
      title: "Claude API Key Invalid",
      description: "Claude API keys should start with 'sk-ant-'",
      variant: "destructive"
    });
    return false;
  }
  
  if (type === 'gemini' && !key.startsWith('AIza')) {
    toast({
      title: "Gemini API Key Invalid",
      description: "Gemini API keys typically start with 'AIza'",
      variant: "destructive"
    });
    return false;
  }
  
  // More lenient validation for Groq keys
  if (type === 'groq') {
    // Allow any reasonably long key for Groq (minimum 20 characters)
    // This is more permissive as Groq API key formats may vary
    if (key.trim().length < 20) {
      toast({
        title: "Groq API Key Invalid",
        description: "The Groq API key you entered seems too short. It should be at least 20 characters.",
        variant: "destructive"
      });
      return false;
    }
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
  
  // Save to localStorage with clear handling of empty strings
  if (updatedKeys.openaiApiKey) localStorage.setItem('openaiApiKey', updatedKeys.openaiApiKey);
  else localStorage.removeItem('openaiApiKey');
  
  if (updatedKeys.claudeApiKey) localStorage.setItem('claudeApiKey', updatedKeys.claudeApiKey);
  else localStorage.removeItem('claudeApiKey');
  
  if (updatedKeys.geminiApiKey) localStorage.setItem('geminiApiKey', updatedKeys.geminiApiKey);
  else localStorage.removeItem('geminiApiKey');
  
  if (updatedKeys.deepseekApiKey) localStorage.setItem('deepseekApiKey', updatedKeys.deepseekApiKey);
  else localStorage.removeItem('deepseekApiKey');
  
  if (updatedKeys.groqApiKey) {
    localStorage.setItem('groqApiKey', updatedKeys.groqApiKey);
    console.log('Saved Groq API key to localStorage. Length:', updatedKeys.groqApiKey.length);
  }
  else localStorage.removeItem('groqApiKey');
  
  console.log('Saved API keys to localStorage:', {
    openai: updatedKeys.openaiApiKey ? 'present' : 'not set',
    claude: updatedKeys.claudeApiKey ? 'present' : 'not set',
    gemini: updatedKeys.geminiApiKey ? 'present' : 'not set',
    deepseek: updatedKeys.deepseekApiKey ? 'present' : 'not set',
    groq: updatedKeys.groqApiKey ? 'present' : 'not set',
    groqKeyLength: updatedKeys.groqApiKey ? updatedKeys.groqApiKey.length : 0
  });
  
  // Trigger multiple events to ensure all components are notified
  try {
    // Dispatch events to notify other components about API key changes
    window.dispatchEvent(new Event('apikey-updated'));
    window.dispatchEvent(new Event('localStorage-changed'));
    window.dispatchEvent(new Event('storage'));
    
    // Force a storage event by setting and removing a dummy key
    localStorage.setItem('_dummy_key_', Date.now().toString());
    localStorage.removeItem('_dummy_key_');
    
    // Try broadcasting channel if available
    if (typeof BroadcastChannel !== 'undefined') {
      const broadcastChannel = new BroadcastChannel('api-key-updates');
      broadcastChannel.postMessage({ 
        hasApiKeys: true, 
        timestamp: Date.now(),
        updatedKeys: {
          openai: !!updatedKeys.openaiApiKey,
          claude: !!updatedKeys.claudeApiKey,
          gemini: !!updatedKeys.geminiApiKey,
          deepseek: !!updatedKeys.deepseekApiKey,
          groq: !!updatedKeys.groqApiKey
        }
      });
      broadcastChannel.close();
    }
  } catch (e) {
    console.error("Error while dispatching API key events:", e);
  }
  
  // Show toast notification for Groq specifically
  if (updatedKeys.groqApiKey) {
    showApiKeySavedToast('Groq', updatedKeys.groqApiKey.length);
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
  
  console.log('Loading API keys from localStorage in loadApiKeysFromStorage:', {
    openai: savedOpenAIKey ? 'present' : 'not found',
    claude: savedClaudeKey ? 'present' : 'not found',
    gemini: savedGeminiKey ? 'present' : 'not found',
    deepseek: savedDeepseekKey ? 'present' : 'not found',
    groq: savedGroqKey ? 'present' : 'not found',
    groqKeyLength: savedGroqKey ? savedGroqKey.length : 0
  });
  
  return {
    openaiApiKey: savedOpenAIKey,
    claudeApiKey: savedClaudeKey,
    geminiApiKey: savedGeminiKey,
    deepseekApiKey: savedDeepseekKey,
    groqApiKey: savedGroqKey
  };
};

// Add new utility function to forcefully reload API keys across components
export const forceApiKeyReload = (): void => {
  console.log('Forcing API key reload across all components');
  
  // Dispatch multiple events
  window.dispatchEvent(new Event('apikey-updated'));
  window.dispatchEvent(new Event('localStorage-changed'));
  window.dispatchEvent(new Event('storage'));
  
  // Force a storage event by setting and removing a dummy key
  try {
    localStorage.setItem('_dummy_key_', Date.now().toString());
    localStorage.removeItem('_dummy_key_');
  } catch (err) {
    console.error('Error triggering storage event:', err);
  }
  
  // Show toast
  showAllApiKeysRefreshedToast();
};
