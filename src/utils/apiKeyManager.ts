
// Function to save API key to local storage
export const saveApiKey = (type: 'openai' | 'groq' | 'claude' | 'anthropic' | 'gemini' | 'deepseek', key: string): boolean => {
  try {
    if (!key || key.trim().length < 10) {
      console.error(`Invalid ${type} API key`);
      return false;
    }
    
    // Validate key format based on type
    const isValid = validateKeyFormat(type, key.trim());
    if (!isValid) {
      console.error(`Invalid format for ${type} API key`);
      return false;
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

// Function to validate key format based on provider
const validateKeyFormat = (type: string, key: string): boolean => {
  switch (type) {
    case 'openai':
      return key.startsWith('sk-');
    case 'groq':
      return key.startsWith('gsk_');
    case 'claude':
    case 'anthropic':
      return key.startsWith('sk-ant-');
    case 'gemini':
      return key.startsWith('AIza');
    case 'deepseek':
      return key.startsWith('sk-'); // DeepSeek also uses 'sk-' prefix
    default:
      return true; // Default to accepting any format for unknown types
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

// Function to test if API key works with the provider
export const testApiKeyConnection = async (type: 'openai' | 'groq' | 'claude' | 'anthropic' | 'gemini' | 'deepseek'): Promise<boolean> => {
  try {
    // For now, just check if the key exists and has valid format
    return hasApiKey(type);
    
    // Future: Actually test the connection by making a lightweight API call
  } catch (error) {
    console.error(`Error testing ${type} API key connection:`, error);
    return false;
  }
};
