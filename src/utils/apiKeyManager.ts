
/**
 * Centralized API key management utility
 * This eliminates conflicts between different components trying to save/retrieve API keys
 */

// Event name constants
export const API_KEY_UPDATED_EVENT = 'apikey-updated';
export const LOCALSTORAGE_CHANGED_EVENT = 'localStorage-changed';

/**
 * Save an API key to localStorage with proper validation and event dispatching
 */
export const saveApiKey = (provider: string, apiKey: string): boolean => {
  try {
    // Skip if key is empty
    if (!apiKey || apiKey.trim() === '') {
      console.log(`No ${provider} API key provided, skipping save`);
      localStorage.removeItem(`${provider}ApiKey`);
      broadcastApiKeyChange(false);
      return false;
    }
    
    // Save to localStorage
    localStorage.setItem(`${provider}ApiKey`, apiKey.trim());
    
    // Verify the key was saved correctly
    const savedKey = localStorage.getItem(`${provider}ApiKey`);
    if (!savedKey) {
      console.error(`Failed to save ${provider} API key to localStorage`);
      return false;
    }
    
    console.log(`${provider} API key saved successfully to localStorage. Length: ${savedKey.length}`);
    
    // Broadcast the change
    broadcastApiKeyChange(true);
    return true;
  } catch (error) {
    console.error(`Error saving ${provider} API key:`, error);
    return false;
  }
};

/**
 * Get an API key from localStorage
 */
export const getApiKey = (provider: string): string | null => {
  try {
    const key = localStorage.getItem(`${provider}ApiKey`);
    return key;
  } catch (error) {
    console.error(`Error getting ${provider} API key:`, error);
    return null;
  }
};

/**
 * Check if an API key exists in localStorage
 */
export const hasApiKey = (provider: string): boolean => {
  const key = getApiKey(provider);
  return !!key && key.trim().length > 0;
};

/**
 * Broadcast API key changes to all components
 */
export const broadcastApiKeyChange = (exists: boolean): void => {
  try {
    console.log(`Broadcasting API key change. Key exists: ${exists}`);
    
    // Dispatch custom events
    window.dispatchEvent(new Event(API_KEY_UPDATED_EVENT));
    window.dispatchEvent(new Event(LOCALSTORAGE_CHANGED_EVENT));
    window.dispatchEvent(new Event('storage'));
    
    // Use BroadcastChannel if available for cross-tab communication
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('api-key-updates');
        channel.postMessage({ 
          type: 'api-key-update',
          timestamp: Date.now(),
          exists
        });
        channel.close();
      } catch (err) {
        console.error("Failed to use BroadcastChannel:", err);
      }
    }
    
    // Force a storage event by setting and removing a dummy key
    const dummyKey = `_dummy_key_${Date.now()}`;
    localStorage.setItem(dummyKey, Date.now().toString());
    localStorage.removeItem(dummyKey);
  } catch (error) {
    console.error('Error broadcasting API key change:', error);
  }
};
