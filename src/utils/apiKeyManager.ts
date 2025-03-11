
// Define supported API key types
type ApiKeyType = "openai" | "groq" | "claude" | "anthropic" | "gemini" | "deepseek";

/**
 * Get API key from localStorage
 */
export const getApiKey = (keyType: ApiKeyType): string | null => {
  const key = localStorage.getItem(`${keyType}ApiKey`);
  return key || null;
};

/**
 * Check if API key exists and is valid
 */
export const hasApiKey = (keyType: ApiKeyType): boolean => {
  const key = getApiKey(keyType);
  return !!key && key.length > 10;
};

/**
 * Save API key to localStorage
 */
export const saveApiKey = (keyType: ApiKeyType, apiKey: string): boolean => {
  try {
    if (!apiKey || apiKey.trim() === '') {
      localStorage.removeItem(`${keyType}ApiKey`);
      broadcastApiKeyChange(keyType, false);
      
      // Dispatch a custom event for other components to react to
      const event = new CustomEvent('apikey-updated', { 
        detail: { keyType, removed: true } 
      });
      window.dispatchEvent(event);
      
      return true;
    }
    
    localStorage.setItem(`${keyType}ApiKey`, apiKey);
    
    // Dispatch a custom event for other components to react to
    const event = new CustomEvent('apikey-updated', { 
      detail: { keyType, added: true } 
    });
    window.dispatchEvent(event);
    
    broadcastApiKeyChange(keyType, true);
    
    // Also trigger a localStorage change event for compatibility
    const storageEvent = new CustomEvent('localStorage-changed', {
      detail: { key: `${keyType}ApiKey` }
    });
    window.dispatchEvent(storageEvent);
    
    return true;
  } catch (error) {
    console.error(`Error saving ${keyType} API key:`, error);
    return false;
  }
};

/**
 * Remove API key from localStorage
 */
export const removeApiKey = (keyType: ApiKeyType): boolean => {
  try {
    localStorage.removeItem(`${keyType}ApiKey`);
    
    // Dispatch a custom event for other components to react to
    const event = new CustomEvent('apikey-updated', { 
      detail: { keyType, removed: true } 
    });
    window.dispatchEvent(event);
    
    broadcastApiKeyChange(keyType, false);
    
    return true;
  } catch (error) {
    console.error(`Error removing ${keyType} API key:`, error);
    return false;
  }
};

/**
 * Broadcast API key change to other tabs
 */
export const broadcastApiKeyChange = (keyType: ApiKeyType, isAvailable: boolean) => {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('api-key-updates');
      channel.postMessage({
        type: 'api-key-update',
        keyType,
        isAvailable
      });
    }
  } catch (error) {
    console.error("Error broadcasting API key change:", error);
  }
};

/**
 * Get all available API key providers
 */
export const getAvailableProviders = (): {provider: ApiKeyType, hasKey: boolean}[] => {
  return [
    { provider: "openai", hasKey: hasApiKey("openai") },
    { provider: "groq", hasKey: hasApiKey("groq") },
    { provider: "claude", hasKey: hasApiKey("claude") },
    { provider: "anthropic", hasKey: hasApiKey("anthropic") },
    { provider: "gemini", hasKey: hasApiKey("gemini") },
    { provider: "deepseek", hasKey: hasApiKey("deepseek") }
  ];
};

// For backward compatibility
export { broadcastApiKeyChange as broadcastApiKeychange };
