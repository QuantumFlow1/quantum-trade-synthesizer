
import { ApiKeySettings } from '../types/GrokSettings';
import { toast } from '@/hooks/use-toast';
import { fetchAdminApiKey } from '../services/utils/apiHelpers';

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
  
  return true;
};

export const saveApiKeysToLocalStorage = (keys: ApiKeySettings): void => {
  if (keys.openaiApiKey) localStorage.setItem('openaiApiKey', keys.openaiApiKey);
  if (keys.claudeApiKey) localStorage.setItem('claudeApiKey', keys.claudeApiKey);
  if (keys.geminiApiKey) localStorage.setItem('geminiApiKey', keys.geminiApiKey);
  if (keys.deepseekApiKey) localStorage.setItem('deepseekApiKey', keys.deepseekApiKey);
  
  console.log('Saved API keys to localStorage:', {
    openai: keys.openaiApiKey ? 'present' : 'not set',
    claude: keys.claudeApiKey ? 'present' : 'not set',
    gemini: keys.geminiApiKey ? 'present' : 'not set',
    deepseek: keys.deepseekApiKey ? 'present' : 'not set'
  });
};

export const loadApiKeysFromStorage = (): ApiKeySettings => {
  return {
    openaiApiKey: localStorage.getItem('openaiApiKey') || '',
    claudeApiKey: localStorage.getItem('claudeApiKey') || '',
    geminiApiKey: localStorage.getItem('geminiApiKey') || '',
    deepseekApiKey: localStorage.getItem('deepseekApiKey') || '',
  };
};

export const loadAdminApiKeys = async (): Promise<ApiKeySettings> => {
  const keysToUpdate: ApiKeySettings = loadApiKeysFromStorage();
  
  try {
    // Try to fetch from admin database if not in localStorage
    if (!keysToUpdate.openaiApiKey) {
      const adminOpenAIKey = await fetchAdminApiKey('openai');
      if (adminOpenAIKey) {
        console.log('Found admin OpenAI key');
        keysToUpdate.openaiApiKey = adminOpenAIKey;
        // Save to localStorage to avoid future fetches
        localStorage.setItem('openaiApiKey', adminOpenAIKey);
      }
    }
    
    if (!keysToUpdate.claudeApiKey) {
      const adminClaudeKey = await fetchAdminApiKey('claude');
      if (adminClaudeKey) {
        console.log('Found admin Claude key');
        keysToUpdate.claudeApiKey = adminClaudeKey;
        localStorage.setItem('claudeApiKey', adminClaudeKey);
      }
    }
    
    if (!keysToUpdate.geminiApiKey) {
      const adminGeminiKey = await fetchAdminApiKey('gemini');
      if (adminGeminiKey) {
        console.log('Found admin Gemini key');
        keysToUpdate.geminiApiKey = adminGeminiKey;
        localStorage.setItem('geminiApiKey', adminGeminiKey);
      }
    }
    
    if (!keysToUpdate.deepseekApiKey) {
      const adminDeepseekKey = await fetchAdminApiKey('deepseek');
      if (adminDeepseekKey) {
        console.log('Found admin DeepSeek key');
        keysToUpdate.deepseekApiKey = adminDeepseekKey;
        localStorage.setItem('deepseekApiKey', adminDeepseekKey);
      }
    }
  } catch (error) {
    console.error('Error loading admin API keys:', error);
  }
  
  return keysToUpdate;
};

export const renderApiKeyMasked = (apiKey: string): string => {
  if (!apiKey) return '';
  if (apiKey.length <= 8) return '••••••••';
  return apiKey.substring(0, 4) + '••••••••' + apiKey.substring(apiKey.length - 4);
};
