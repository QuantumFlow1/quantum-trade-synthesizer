
import { loadApiKeysFromStorage } from "@/components/chat/api-keys/apiKeyUtils";
import { supabase } from "@/lib/supabase";

/**
 * Checks if API keys are available either from user storage or admin settings
 */
export const checkApiKeysAvailability = async (): Promise<boolean> => {
  try {
    // First check localStorage for user-provided keys
    const userKeys = loadApiKeysFromStorage();
    const hasUserKeys = !!(userKeys.openaiApiKey || userKeys.claudeApiKey || 
                       userKeys.geminiApiKey || userKeys.deepseekApiKey || userKeys.groqApiKey);
    
    console.log("User API keys availability check:", {
      openai: !!userKeys.openaiApiKey,
      claude: !!userKeys.claudeApiKey,
      gemini: !!userKeys.geminiApiKey,
      deepseek: !!userKeys.deepseekApiKey,
      groq: !!userKeys.groqApiKey,
      hasAnyKey: hasUserKeys
    });
    
    if (hasUserKeys) {
      return true; // If user has keys, we can use them
    }
    
    // If no user keys, check admin keys in the backend
    try {
      const { data, error } = await supabase.functions.invoke('check-api-keys', {
        body: { service: 'grok3', checkSecret: true }
      });
      
      if (error) {
        console.error("Error checking admin API keys:", error);
        return false;
      }
      
      const hasAdminKeys = data?.secretSet === true;
      console.log("Admin API keys availability:", hasAdminKeys);
      
      return hasAdminKeys;
    } catch (err) {
      console.error("Exception checking admin API keys:", err);
      return false;
    }
  } catch (e) {
    console.error("Error in checkApiKeysAvailability:", e);
    return false;
  }
};

/**
 * Gets the appropriate API key for a given service
 */
export const getApiKey = async (service: string): Promise<string | null> => {
  try {
    // First check localStorage for user-provided key
    const userKeys = loadApiKeysFromStorage();
    
    let userKey = null;
    switch (service.toLowerCase()) {
      case 'openai':
        userKey = userKeys.openaiApiKey;
        break;
      case 'claude':
        userKey = userKeys.claudeApiKey;
        break;
      case 'gemini':
        userKey = userKeys.geminiApiKey;
        break;
      case 'deepseek':
        userKey = userKeys.deepseekApiKey;
        break;
      case 'groq':
        userKey = userKeys.groqApiKey;
        break;
    }
    
    if (userKey) {
      console.log(`Using user-provided ${service} API key`);
      return userKey;
    }
    
    // If no user key, try to get admin key
    const { data, error } = await supabase.functions.invoke('get-admin-key', {
      body: { provider: service.toLowerCase() }
    });
    
    if (error) {
      console.error(`Error getting admin ${service} API key:`, error);
      return null;
    }
    
    if (data?.key) {
      console.log(`Using admin ${service} API key`);
      return data.key;
    }
    
    console.log(`No ${service} API key available`);
    return null;
  } catch (e) {
    console.error(`Error getting ${service} API key:`, e);
    return null;
  }
};
