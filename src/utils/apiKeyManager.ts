
/**
 * Utility for managing API keys securely in local storage
 */

// Valid key types
const validKeyTypes = ["openai", "groq", "anthropic", "gemini", "deepseek", "mistral"];

// Save API key to localStorage
export const saveApiKey = (keyType: string, key: string): boolean => {
  try {
    // Validate key type
    const normalizedKeyType = keyType.toLowerCase();
    if (!validKeyTypes.includes(normalizedKeyType)) {
      console.error(`Invalid API key type: ${keyType}`);
      return false;
    }
    
    // Store the key in localStorage
    localStorage.setItem(`${normalizedKeyType}ApiKey`, key);
    
    // Broadcast the change
    broadcastApiKeyChange(normalizedKeyType, 'set');
    
    return true;
  } catch (error) {
    console.error("Error saving API key:", error);
    return false;
  }
};

// Get API key from localStorage
export const getApiKey = (keyType: string): string | null => {
  try {
    const normalizedKeyType = keyType.toLowerCase();
    if (!validKeyTypes.includes(normalizedKeyType)) {
      console.error(`Invalid API key type: ${keyType}`);
      return null;
    }
    
    return localStorage.getItem(`${normalizedKeyType}ApiKey`);
  } catch (error) {
    console.error("Error getting API key:", error);
    return null;
  }
};

// Check if API key exists
export const hasApiKey = (keyType: string): boolean => {
  const key = getApiKey(keyType);
  return key !== null && key.length > 0;
};

// Remove API key from localStorage
export const removeApiKey = (keyType: string): boolean => {
  try {
    const normalizedKeyType = keyType.toLowerCase();
    if (!validKeyTypes.includes(normalizedKeyType)) {
      console.error(`Invalid API key type: ${keyType}`);
      return false;
    }
    
    localStorage.removeItem(`${normalizedKeyType}ApiKey`);
    
    // Broadcast the change
    broadcastApiKeyChange(normalizedKeyType, 'remove');
    
    return true;
  } catch (error) {
    console.error("Error removing API key:", error);
    return false;
  }
};

// Generic method to broadcast API key changes to other tabs
export const broadcastApiKeyChange = (keyType: string, action: 'set' | 'remove') => {
  try {
    // Use BroadcastChannel if available (not available in all browsers)
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('api-key-updates');
      channel.postMessage({
        type: 'api-key-update',
        keyType,
        action
      });
      channel.close();
    }
    
    // Also dispatch a custom event for in-tab communication
    window.dispatchEvent(new CustomEvent('api-key-update', {
      detail: { keyType, action }
    }));
  } catch (error) {
    console.error("Error broadcasting API key change:", error);
  }
};

// Check any API key availability
export const hasAnyApiKey = (): boolean => {
  return validKeyTypes.some(keyType => hasApiKey(keyType));
};

// Get available API key providers
export const getAvailableProviders = (): Record<string, boolean> => {
  const providers: Record<string, boolean> = {};
  
  validKeyTypes.forEach(keyType => {
    providers[keyType] = hasApiKey(keyType);
  });
  
  return providers;
};
