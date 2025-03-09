
import { loadApiKeysFromStorage } from "@/components/chat/api-keys/apiKeyUtils";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

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
        body: { service: 'any', checkSecret: true }
      });
      
      if (error) {
        console.error("Error checking admin API keys:", error);
        // Don't fail silently, show toast with error
        toast({
          title: "API Connection Error", 
          description: "Could not verify API key availability. Using simulation mode.",
          variant: "destructive",
          duration: 5000
        });
        return false;
      }
      
      const hasAdminKeys = data?.secretSet === true;
      console.log("Admin API keys availability:", hasAdminKeys);
      
      if (!hasAdminKeys) {
        // Log that no admin keys are available
        console.warn("No admin API keys available, please configure API keys");
        // Only show toast if we're in a browser context
        if (typeof window !== 'undefined') {
          toast({
            title: "API Keys Required",
            description: "Please configure API keys to use advanced features.",
            variant: "warning",
            duration: 5000
          });
        }
      }
      
      return hasAdminKeys;
    } catch (err) {
      console.error("Exception checking admin API keys:", err);
      // Show visible error to user
      if (typeof window !== 'undefined') {
        toast({
          title: "API Service Error",
          description: "Error connecting to API service. Using simulation mode.",
          variant: "destructive",
          duration: 5000
        });
      }
      return false;
    }
  } catch (e) {
    console.error("Error in checkApiKeysAvailability:", e);
    return false;
  }
};

/**
 * Gets the appropriate API key for a given service
 * Includes fallback logic and error handling
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
    
    // If no user key, try to get admin key with fallback and error handling
    try {
      const { data, error } = await supabase.functions.invoke('get-admin-key', {
        body: { provider: service.toLowerCase() }
      });
      
      if (error) {
        console.error(`Error getting admin ${service} API key:`, error);
        throw new Error(`Failed to retrieve admin ${service} API key: ${error.message}`);
      }
      
      if (data?.key) {
        console.log(`Using admin ${service} API key`);
        return data.key;
      }
      
      console.log(`No ${service} API key available`);
      return null;
    } catch (adminKeyError) {
      console.error(`Error retrieving admin ${service} API key:`, adminKeyError);
      
      // If we couldn't get the admin key, try alternative services if they're available
      if (service.toLowerCase() !== 'openai' && userKeys.openaiApiKey) {
        console.log(`Falling back to OpenAI API key since ${service} key is unavailable`);
        return userKeys.openaiApiKey;
      } else if (service.toLowerCase() !== 'groq' && userKeys.groqApiKey) {
        console.log(`Falling back to Groq API key since ${service} key is unavailable`);
        return userKeys.groqApiKey;
      }
      
      // Show error toast to user
      if (typeof window !== 'undefined') {
        toast({
          title: "API Key Error",
          description: `Could not access ${service} API key. Try configuring it in settings.`,
          variant: "destructive",
          duration: 5000
        });
      }
      
      return null;
    }
  } catch (e) {
    console.error(`Error getting ${service} API key:`, e);
    // Show error toast to user
    if (typeof window !== 'undefined') {
      toast({
        title: "API Configuration Error",
        description: "There was a problem with your API configuration. Please check settings.",
        variant: "destructive",
        duration: 5000
      });
    }
    return null;
  }
};
