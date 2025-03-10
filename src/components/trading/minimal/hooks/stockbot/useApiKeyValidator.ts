
import { hasApiKey } from "@/utils/apiKeyManager";
import { supabase } from "@/lib/supabase";

/**
 * Hook for API key validation logic
 */
export const useApiKeyValidator = () => {
  /**
   * Check if the Groq API key exists with caching
   * @param checkAdminKeys Whether to also check for admin keys (defaults to true)
   */
  const validateGroqApiKey = async (checkAdminKeys: boolean = true): Promise<boolean> => {
    try {
      // First check locally stored key
      const keyExists = hasApiKey('groq');
      
      // If we have a local key, return immediately
      if (keyExists) {
        console.log('useApiKeyValidator - Local API key found:', {
          exists: true,
          timestamp: new Date().toISOString()
        });
        return true;
      }
      
      // If we should check admin keys and no local key exists
      if (checkAdminKeys) {
        try {
          const { data, error } = await supabase.functions.invoke('check-api-keys', {
            body: { service: 'groq' }
          });
          
          if (error) {
            console.error("Error checking admin API keys:", error);
            return false;
          }
          
          const hasAdminKey = data?.available || false;
          
          console.log('useApiKeyValidator - Admin API key check:', {
            exists: hasAdminKey,
            timestamp: new Date().toISOString()
          });
          
          return hasAdminKey;
        } catch (err) {
          console.error("Error checking admin API keys:", err);
          return false;
        }
      }
      
      return false;
    } catch (err) {
      console.error("Error validating API key:", err);
      return false;
    }
  };

  return {
    validateGroqApiKey
  };
};
