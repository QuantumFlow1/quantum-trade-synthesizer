
// API Key management utilities

/**
 * Check if an API key is available for a specific provider
 * @param provider The AI provider (openai, claude, groq, etc.)
 * @returns true if a key is available in localStorage
 */
export function hasApiKey(provider: string): boolean {
  const key = localStorage.getItem(`${provider}ApiKey`);
  return !!key && key.length > 10;
}

/**
 * Save an API key to localStorage for a specific provider
 * @param provider The AI provider (openai, claude, groq, etc.)
 * @param apiKey The API key to save
 * @returns true if the key was saved successfully
 */
export function saveApiKey(provider: string, apiKey: string): boolean {
  try {
    if (apiKey && apiKey.trim()) {
      localStorage.setItem(`${provider}ApiKey`, apiKey.trim());
      broadcastApiKeyChange();
      return true;
    } else {
      // If empty key, remove it
      localStorage.removeItem(`${provider}ApiKey`);
      broadcastApiKeyChange();
      return true;
    }
  } catch (error) {
    console.error(`Error saving ${provider} API key:`, error);
    return false;
  }
}

/**
 * Broadcast an event to notify other components that an API key has changed
 */
export function broadcastApiKeyChange(): void {
  // Dispatch custom event for components that listen for it
  window.dispatchEvent(new Event('apikey-updated'));
  
  // Also dispatch a storage event
  window.dispatchEvent(new Event('storage'));
  
  // Force a storage event by setting and removing a dummy key
  localStorage.setItem('_dummy_key_', Date.now().toString());
  localStorage.removeItem('_dummy_key_');
}

/**
 * Get an API key from localStorage for a specific provider
 * @param provider The AI provider (openai, claude, groq, etc.)
 * @returns The API key or null if not found
 */
export function getApiKey(provider: string): string | null {
  return localStorage.getItem(`${provider}ApiKey`);
}

/**
 * Check if API keys are available for AI features
 * @returns Object indicating which providers have keys available
 */
export function getAvailableProviders(): Record<string, boolean> {
  return {
    openai: hasApiKey('openai'),
    claude: hasApiKey('claude'),
    groq: hasApiKey('groq'),
    gemini: hasApiKey('gemini'),
    deepseek: hasApiKey('deepseek')
  };
}
