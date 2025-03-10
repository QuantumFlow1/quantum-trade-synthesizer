
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
    console.log(`Attempting to save ${provider} API key with length: ${apiKey ? apiKey.length : 0}`);
    
    // Skip if key is empty
    if (!apiKey || apiKey.trim() === '') {
      console.log(`No ${provider} API key provided, skipping save`);
      localStorage.removeItem(`${provider}ApiKey`);
      broadcastApiKeyChange(false);
      return false;
    }
    
    // Save to localStorage with explicit trimming
    const trimmedKey = apiKey.trim();
    localStorage.setItem(`${provider}ApiKey`, trimmedKey);
    
    // Double-check the key was saved correctly
    const savedKey = localStorage.getItem(`${provider}ApiKey`);
    
    // Log the key info for debugging (safely)
    if (savedKey) {
      const firstChars = savedKey.substring(0, 3);
      const lastChars = savedKey.length > 3 ? savedKey.substring(savedKey.length - 3) : '';
      console.log(`${provider} API key saved: ${firstChars}...${lastChars}, length: ${savedKey.length}`);
    } else {
      console.error(`Failed to save ${provider} API key to localStorage`);
    }
    
    if (!savedKey || savedKey !== trimmedKey) {
      console.error(`Failed to save ${provider} API key to localStorage: ` + 
                   `Expected '${trimmedKey.substring(0, 3)}...' but got '${savedKey?.substring(0, 3) || "null"}...'`);
      
      // Try again with a different approach
      try {
        console.log(`Trying alternative method to save ${provider} API key`);
        window.localStorage.setItem(`${provider}ApiKey`, trimmedKey);
        
        // Check again
        const retryKey = localStorage.getItem(`${provider}ApiKey`);
        if (retryKey && retryKey === trimmedKey) {
          console.log(`Successfully saved ${provider} API key using alternative method`);
          broadcastApiKeyChange(true);
          return true;
        }
      } catch (retryErr) {
        console.error(`Failed alternative save method for ${provider} API key:`, retryErr);
      }
      
      return false;
    }
    
    console.log(`${provider} API key saved successfully to localStorage. Length: ${savedKey.length}`);
    
    // Broadcast the change
    broadcastApiKeyChange(true);
    return true;
  } catch (error) {
    console.error(`Error saving ${provider} API key:`, error);
    
    // Last resort: direct localStorage access
    try {
      console.log(`Last resort: direct localStorage access for ${provider} API key`);
      localStorage.setItem(`${provider}ApiKey`, apiKey.trim());
      return true;
    } catch (finalErr) {
      console.error(`Final attempt to save ${provider} API key failed:`, finalErr);
      return false;
    }
  }
};

/**
 * Get an API key from localStorage
 */
export const getApiKey = (provider: string): string | null => {
  try {
    const key = localStorage.getItem(`${provider}ApiKey`);
    if (key && key.trim().length > 0) {
      // Log key information for debugging (safely)
      const firstChars = key.substring(0, 3);
      const lastChars = key.length > 3 ? key.substring(key.length - 3) : '';
      console.log(`Retrieved ${provider} API key: ${firstChars}...${lastChars}, length: ${key.length}`);
      return key;
    }
    console.log(`No valid ${provider} API key found in localStorage`);
    return null;
  } catch (error) {
    console.error(`Error getting ${provider} API key:`, error);
    return null;
  }
};

/**
 * Check if an API key exists in localStorage
 */
export const hasApiKey = (provider: string): boolean => {
  try {
    const key = getApiKey(provider);
    const hasKey = !!key && key.trim().length > 0;
    console.log(`Checking for ${provider} API key: ${hasKey ? 'Found' : 'Not found'}, length: ${key ? key.length : 0}`);
    return hasKey;
  } catch (error) {
    console.error(`Error checking for ${provider} API key:`, error);
    
    // Direct localStorage check as fallback
    try {
      const directKey = localStorage.getItem(`${provider}ApiKey`);
      return !!directKey && directKey.trim().length > 0;
    } catch (fallbackErr) {
      console.error(`Fallback check for ${provider} API key failed:`, fallbackErr);
      return false;
    }
  }
};

/**
 * Broadcast API key changes to all components
 */
export const broadcastApiKeyChange = (exists: boolean): void => {
  try {
    console.log(`Broadcasting API key change. Key exists: ${exists}`);
    
    // Dispatch custom events
    window.dispatchEvent(new CustomEvent(API_KEY_UPDATED_EVENT, { detail: { exists } }));
    window.dispatchEvent(new CustomEvent(LOCALSTORAGE_CHANGED_EVENT, { detail: { exists } }));
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
    
    // Dispatch synthetic events to ensure maximum compatibility
    try {
      const storageEvent = new StorageEvent('storage', {
        key: 'groqApiKey',
        newValue: exists ? 'changed' : null,
        storageArea: localStorage
      });
      window.dispatchEvent(storageEvent);
    } catch (err) {
      console.error("Failed to dispatch synthetic storage event:", err);
    }
  } catch (error) {
    console.error('Error broadcasting API key change:', error);
  }
};
