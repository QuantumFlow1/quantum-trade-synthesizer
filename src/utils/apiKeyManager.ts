
// Function to save API key to local storage
export const saveApiKey = (type: 'openai' | 'groq' | 'claude' | 'anthropic' | 'gemini' | 'deepseek', key: string): boolean => {
  try {
    if (!key || key.trim().length < 10) {
      console.error(`Invalid ${type} API key`);
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

// Function to check if API key exists
export const hasApiKey = (type: 'openai' | 'groq' | 'claude' | 'anthropic' | 'gemini' | 'deepseek'): boolean => {
  const key = getApiKey(type);
  return !!key && key.length > 10;
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
