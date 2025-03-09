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
    console.warn("OpenAI API key validation warning: Key does not start with 'sk-'");
    // More permissive validation - just warn but accept
    return true;
  }
  
  if (type === 'claude' && !key.startsWith('sk-ant-')) {
    console.warn("Claude API key validation warning: Key does not start with 'sk-ant-'");
    // More permissive validation - just warn but accept
    return true;
  }
  
  if (type === 'gemini' && !key.startsWith('AIza')) {
    console.warn("Gemini API key validation warning: Key does not start with 'AIza'");
    // More permissive validation - just warn but accept
    return true;
  }
  
  // Lenient validation for Groq keys - just check length
  if (type === 'groq' && key.trim().length < 10) {
    toast({
      title: "Groq API Key Short",
      description: "The Groq API key you entered seems short. Make sure it's correct.",
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
  
  console.log('Saving API keys:', {
    openai: updatedKeys.openaiApiKey ? `present (${updatedKeys.openaiApiKey.length} chars)` : 'not set',
    claude: updatedKeys.claudeApiKey ? `present (${updatedKeys.claudeApiKey.length} chars)` : 'not set',
    gemini: updatedKeys.geminiApiKey ? `present (${updatedKeys.geminiApiKey.length} chars)` : 'not set',
    deepseek: updatedKeys.deepseekApiKey ? `present (${updatedKeys.deepseekApiKey.length} chars)` : 'not set',
    groq: updatedKeys.groqApiKey ? `present (${updatedKeys.groqApiKey.length} chars)` : 'not set'
  });
  
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
      try {
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
      } catch (err) {
        console.error("Failed to use BroadcastChannel:", err);
      }
    }
  } catch (e) {
    console.error("Error while dispatching API key events:", e);
  }
  
  // Show toast notification for Groq specifically
  if (updatedKeys.groqApiKey) {
    showApiKeySavedToast('Groq');
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
