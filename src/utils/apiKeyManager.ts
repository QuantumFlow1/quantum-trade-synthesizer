
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
    
    return true;
  } catch (error) {
    console.error(`Error removing ${type} API key:`, error);
    return false;
  }
};
