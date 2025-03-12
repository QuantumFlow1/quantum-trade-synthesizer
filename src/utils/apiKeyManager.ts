
/**
 * Utility for managing API keys in the application
 */

// For type safety
type ApiProvider = 'openai' | 'groq' | 'claude' | 'gemini' | 'anthropic' | 'deepseek';

// Storage keys for different API providers
const API_KEY_STORAGE_KEYS: Record<ApiProvider, string> = {
  openai: 'openaiApiKey',
  groq: 'groqApiKey',
  claude: 'claudeApiKey',
  gemini: 'geminiApiKey',
  anthropic: 'claudeApiKey', // alias for claude
  deepseek: 'deepseekApiKey'
};

/**
 * Save an API key to localStorage
 * @param provider The API provider
 * @param key The API key to save
 * @returns Boolean indicating success
 */
export const saveApiKey = (provider: ApiProvider, key: string): boolean => {
  try {
    // Get the correct storage key
    const storageKey = API_KEY_STORAGE_KEYS[provider];
    if (!storageKey) {
      console.error(`Unknown API provider: ${provider}`);
      return false;
    }
    
    // Save the key to localStorage
    localStorage.setItem(storageKey, key);
    
    // Dispatch events to notify other components
    window.dispatchEvent(new Event('localStorage-changed'));
    window.dispatchEvent(new Event('apikey-updated'));
    
    // Dispatch a connection status event
    if (key) {
      window.dispatchEvent(new CustomEvent('connection-status-changed', {
        detail: { provider, status: 'connected' }
      }));
    } else {
      window.dispatchEvent(new CustomEvent('connection-status-changed', {
        detail: { provider, status: 'disconnected' }
      }));
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving ${provider} API key:`, error);
    return false;
  }
};

/**
 * Check if an API key exists for a provider
 * @param provider The API provider
 * @returns Boolean indicating if key exists
 */
export const hasApiKey = (provider: ApiProvider): boolean => {
  try {
    const storageKey = API_KEY_STORAGE_KEYS[provider];
    if (!storageKey) return false;
    
    const key = localStorage.getItem(storageKey);
    return !!key && key.length > 10; // Basic validation - key should be substantial
  } catch (error) {
    console.error(`Error checking for ${provider} API key:`, error);
    return false;
  }
};

/**
 * Get an API key for a provider
 * @param provider The API provider
 * @returns The API key or null if not found
 */
export const getApiKey = (provider: ApiProvider): string | null => {
  try {
    const storageKey = API_KEY_STORAGE_KEYS[provider];
    if (!storageKey) return null;
    
    return localStorage.getItem(storageKey);
  } catch (error) {
    console.error(`Error getting ${provider} API key:`, error);
    return null;
  }
};

/**
 * Validate an API key format for specific providers
 * @param provider The API provider
 * @param key The API key to validate
 * @returns Boolean indicating if key format is valid
 */
export const validateApiKeyFormat = (provider: ApiProvider, key: string): boolean => {
  if (!key || key.trim() === '') return false;
  
  switch (provider) {
    case 'openai':
      return key.startsWith('sk-') && key.length > 20;
    case 'groq':
      return key.startsWith('gsk_') && key.length > 20;
    case 'claude':
    case 'anthropic':
      return key.startsWith('sk-ant-') && key.length > 20;
    case 'gemini':
      return key.startsWith('AIza') && key.length > 20;
    case 'deepseek':
      return key.startsWith('sk-') && key.length > 20;
    default:
      return key.length > 10; // Basic validation for unknown providers
  }
};

/**
 * Remove an API key
 * @param provider The API provider
 * @returns Boolean indicating success
 */
export const removeApiKey = (provider: ApiProvider): boolean => {
  return saveApiKey(provider, '');
};

/**
 * Attempt to test an API key with the actual service
 * @param provider The API provider 
 * @param key The API key to test
 * @returns Promise resolving to boolean indicating if key works
 */
export const testApiKey = async (provider: ApiProvider, key: string): Promise<boolean> => {
  try {
    if (!validateApiKeyFormat(provider, key)) {
      return false;
    }
    
    switch (provider) {
      case 'groq':
        // Test Groq API key
        const groqResponse = await fetch('https://api.groq.com/openai/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          }
        });
        return groqResponse.ok;
        
      case 'openai':
        // Test OpenAI API key
        const openaiResponse = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          }
        });
        return openaiResponse.ok;
        
      // Add more providers as needed
        
      default:
        // For providers without direct testing, just validate format
        return validateApiKeyFormat(provider, key);
    }
  } catch (error) {
    console.error(`Error testing ${provider} API key:`, error);
    return false;
  }
};
