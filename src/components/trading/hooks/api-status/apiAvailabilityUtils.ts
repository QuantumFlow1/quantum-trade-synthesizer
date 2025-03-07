
import { supabase } from "@/lib/supabase";

/**
 * Checks for API key availability in localStorage
 */
export const checkAPIAvailability = async (): Promise<boolean> => {
  try {
    console.log("Checking API availability...");
    
    // Check for API keys in localStorage
    const openaiKey = localStorage.getItem('openaiApiKey');
    const claudeKey = localStorage.getItem('claudeApiKey');
    const geminiKey = localStorage.getItem('geminiApiKey');
    const deepseekKey = localStorage.getItem('deepseekApiKey');
    
    const hasAnyKey = !!(openaiKey || claudeKey || geminiKey || deepseekKey);
    
    console.log("API key availability check:", {
      localStorageKeys: {
        openai: !!openaiKey,
        claude: !!claudeKey,
        gemini: !!geminiKey,
        deepseek: !!deepseekKey
      },
      hasAnyKey
    });
    
    return hasAnyKey;
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
    // Try to ping the market data collector as a proxy for API health
    const { data, error } = await supabase.functions.invoke('market-data-collector', {
      body: { action: 'status_check' }
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
