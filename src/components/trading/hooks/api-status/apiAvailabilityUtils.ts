
import { supabase } from "@/lib/supabase";
import { fetchAdminApiKey } from "@/components/chat/services/utils/apiHelpers";

/**
 * Checks for API key availability in localStorage and admin keys
 */
export const checkAPIAvailability = async (): Promise<boolean> => {
  try {
    console.log("Checking API availability...");
    
    // Check for API keys
    const hasOpenAI = await fetchAdminApiKey('openai');
    const hasClaude = await fetchAdminApiKey('claude');
    const hasGemini = await fetchAdminApiKey('gemini');
    const hasDeepseek = await fetchAdminApiKey('deepseek');
    
    const openaiKey = localStorage.getItem('openaiApiKey');
    const claudeKey = localStorage.getItem('claudeApiKey');
    const geminiKey = localStorage.getItem('geminiApiKey');
    const deepseekKey = localStorage.getItem('deepseekApiKey');
    
    const hasAnyKey = !!(hasOpenAI || hasClaude || hasGemini || hasDeepseek || 
                        openaiKey || claudeKey || geminiKey || deepseekKey);
    
    console.log("API key availability check:", {
      adminKeys: {
        openai: !!hasOpenAI,
        claude: !!hasClaude,
        gemini: !!hasGemini,
        deepseek: !!hasDeepseek
      },
      localStorageKeys: {
        openai: !!openaiKey,
        claude: !!claudeKey,
        gemini: !!geminiKey,
        deepseek: !!deepseekKey
      },
      hasAnyKey
    });
    
    if (!hasAnyKey) {
      console.log("No API keys available");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking API keys:", error);
    return false;
  }
};

/**
 * Pings the API service to check if it's available
 */
export const pingApiService = async (): Promise<{
  isAvailable: boolean;
  message?: string;
}> => {
  try {
    // Try to ping the Grok3 API
    const { data, error } = await supabase.functions.invoke('grok3-ping', {
      body: { isAvailabilityCheck: true }
    });
    
    if (error) {
      console.error("Failed to verify API status:", error);
      return { 
        isAvailable: false, 
        message: error.message 
      };
    } 
    
    if (data?.status === 'available') {
      console.log("API is available");
      return { isAvailable: true };
    } 
    
    console.error("API is unavailable:", data?.message);
    return { 
      isAvailable: false, 
      message: data?.message || "AI services are currently unavailable" 
    };
  } catch (error) {
    console.error("Exception pinging API service:", error);
    return { 
      isAvailable: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};
