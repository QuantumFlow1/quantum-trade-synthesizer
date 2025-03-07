
import { loadApiKeysFromStorage } from "@/components/chat/api-keys/apiKeyUtils";
import { supabase } from "@/lib/supabase";

/**
 * Checks if API keys are available either from user storage or admin settings
 */
export const checkApiKeysAvailability = async (): Promise<boolean> => {
  const userKeys = loadApiKeysFromStorage();
  const hasUserKeys = !!(userKeys.openaiApiKey || userKeys.claudeApiKey || 
                     userKeys.geminiApiKey || userKeys.deepseekApiKey);
  
  console.log("User API keys availability check:", {
    openai: !!userKeys.openaiApiKey,
    claude: !!userKeys.claudeApiKey,
    gemini: !!userKeys.geminiApiKey,
    deepseek: !!userKeys.deepseekApiKey,
    hasAnyKey: hasUserKeys
  });
  
  try {
    const { data, error } = await supabase.functions.invoke('check-api-keys', {
      body: { service: 'grok3', checkSecret: true }
    });
    
    if (error) {
      console.error("Error checking admin API keys:", error);
      return hasUserKeys;
    }
    
    const hasAdminKeys = data?.secretSet === true;
    console.log("Admin API keys availability:", hasAdminKeys);
    
    return hasUserKeys || hasAdminKeys;
  } catch (err) {
    console.error("Exception checking admin API keys:", err);
    return hasUserKeys;
  }
};
