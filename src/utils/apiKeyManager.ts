// Function to save API key to local storage
export const saveApiKey = (type: 'openai' | 'groq' | 'claude' | 'anthropic' | 'gemini' | 'deepseek', key: string): boolean => {
  try {
    if (!key || key.trim().length < 5) {
      console.error(`Invalid ${type} API key - too short`);
      return false;
    }
    
    // More lenient validation - just log warnings but accept keys anyway
    if (type === 'openai' && !key.startsWith('sk-')) {
      console.warn(`Warning: OpenAI API key doesn't start with 'sk-' but will try anyway`);
    }
    if (type === 'groq' && !key.startsWith('gsk_')) {
      console.warn(`Warning: Groq API key doesn't start with 'gsk_' but will try anyway`);
    }
    if (type === 'claude' && !key.startsWith('sk-ant-')) {
      console.warn(`Warning: Claude API key doesn't start with 'sk-ant-' but will try anyway`);
    }
    
    const storageKey = `${type}ApiKey`;
    localStorage.setItem(storageKey, key.trim());
    
    // Dispatch event for listeners
    window.dispatchEvent(new CustomEvent('api-key-updated', { detail: { type, action: 'save' } }));
    
    // Broadcast change via custom method
    broadcastApiKeyChange(type, 'save');
    
    return true;
  } catch (error) {
    console.error(`Error saving ${type} API key:`, error);
    return false;
  }
};

// Function to get API key from local storage
export const getApiKey = (type: 'openai' | 'groq' | 'claude' | 'anthropic' | 'gemini' | 'deepseek'): string | null => {
  try {
    const storageKey = `${type}ApiKey`;
    return localStorage.getItem(storageKey);
  } catch (error) {
    console.error(`Error getting ${type} API key:`, error);
    return null;
  }
};

// Function to check if API key exists and is valid
export const hasApiKey = (type: 'openai' | 'groq' | 'claude' | 'anthropic' | 'gemini' | 'deepseek'): boolean => {
  const key = getApiKey(type);
  return !!key && key.length > 10 && validateKeyFormat(type, key);
};

// Function to validate key format based on provider - more lenient validation
const validateKeyFormat = (type: string, key: string): boolean => {
  // For any key type, at least check for a minimum length
  if (!key || key.length < 8) return false;
  
  // Be more lenient with format requirements - just log warnings but return true
  switch (type) {
    case 'openai':
      if (!key.startsWith('sk-')) {
        console.warn("Warning: OpenAI API key doesn't match expected format, but allowing");
      }
      return true;
    case 'groq':
      if (!key.startsWith('gsk_')) {
        console.warn("Warning: Groq API key doesn't match expected format, but allowing");
      }
      return true;
    case 'claude':
    case 'anthropic':
      if (!key.startsWith('sk-ant-')) {
        console.warn("Warning: Claude API key doesn't match expected format, but allowing");
      }
      return true;
    case 'gemini':
      if (!key.startsWith('AIza')) {
        console.warn("Warning: Gemini API key doesn't match expected format, but allowing");
      }
      return true;
    case 'deepseek':
      if (!key.startsWith('sk-')) {
        console.warn("Warning: DeepSeek API key doesn't match expected format, but allowing");
      }
      return true;
    default:
      return true;
  }
};

// Function to remove API key
export const removeApiKey = (type: 'openai' | 'groq' | 'claude' | 'anthropic' | 'gemini' | 'deepseek'): boolean => {
  try {
    const storageKey = `${type}ApiKey`;
    localStorage.removeItem(storageKey);
    
    // Dispatch event for listeners
    window.dispatchEvent(new CustomEvent('api-key-updated', { detail: { type, action: 'remove' } }));
    
    // Broadcast change via custom method
    broadcastApiKeyChange(type, 'remove');
    
    return true;
  } catch (error) {
    console.error(`Error removing ${type} API key:`, error);
    return false;
  }
};

// Function to broadcast API key changes across components
export const broadcastApiKeyChange = (type: 'openai' | 'groq' | 'claude' | 'anthropic' | 'gemini' | 'deepseek', action: 'save' | 'remove'): void => {
  try {
    // Dispatch a custom event
    window.dispatchEvent(new CustomEvent('apikey-updated', { 
      detail: { type, action }
    }));
    
    // Also dispatch a localStorage change event for broader component updates
    window.dispatchEvent(new CustomEvent('localStorage-changed', {
      detail: { key: `${type}ApiKey`, action }
    }));
    
    console.log(`API key change broadcasted: ${type}, ${action}`);
  } catch (error) {
    console.error('Error broadcasting API key change:', error);
  }
};

// Get all available API providers that have keys configured
export const getAvailableProviders = (): { id: string, name: string }[] => {
  const providers = [];
  
  if (hasApiKey('groq')) {
    providers.push({ id: 'groq', name: 'Groq (Llama)' });
  }
  
  if (hasApiKey('openai')) {
    providers.push({ id: 'openai', name: 'OpenAI (GPT-4)' });
  }
  
  if (hasApiKey('anthropic') || hasApiKey('claude')) {
    providers.push({ id: 'claude', name: 'Anthropic (Claude)' });
  }
  
  if (hasApiKey('gemini')) {
    providers.push({ id: 'gemini', name: 'Google (Gemini)' });
  }
  
  if (hasApiKey('deepseek')) {
    providers.push({ id: 'deepseek', name: 'DeepSeek' });
  }
  
  return providers;
};

// Function to test if API key works with the provider - more robust testing
export const testApiKeyConnection = async (type: 'openai' | 'groq' | 'claude' | 'anthropic' | 'gemini' | 'deepseek'): Promise<boolean> => {
  try {
    const key = getApiKey(type);
    
    // First, just check if the key exists and has reasonable length
    if (!key || key.length < 8) {
      console.log(`API key for ${type} is missing or too short`);
      return false;
    }
    
    console.log(`Testing ${type} API key connection, key length: ${key.length}`);
    
    // For groq, use the specific test function from groqApiClient
    if (type === 'groq') {
      const { groqApi } = await import('./groqApiClient');
      const testResult = await groqApi.hasValidApiKey();
      console.log(`Groq API key validation result: ${testResult}`);
      return testResult;
    }
    
    // For now, if we have a key of reasonable length, assume it's valid
    // In a real implementation, you would make a test call to the respective API
    return true;
  } catch (error) {
    console.error(`Error testing ${type} API key connection:`, error);
    return false;
  }
};
