
import { hasApiKey } from "@/utils/apiKeyManager";

/**
 * Hook for API key validation logic
 */
export const useApiKeyValidator = () => {
  /**
   * Check if the Groq API key exists with caching
   */
  const validateGroqApiKey = (): boolean => {
    try {
      const keyExists = hasApiKey('groq');
      const groqKeyValue = localStorage.getItem('groqApiKey');
      
      console.log('useApiKeyValidator - API key validation:', {
        exists: keyExists,
        keyLength: groqKeyValue ? groqKeyValue.length : 0,
        timestamp: new Date().toISOString()
      });
      
      return keyExists;
    } catch (err) {
      console.error("Error validating API key:", err);
      return false;
    }
  };

  return {
    validateGroqApiKey
  };
};
