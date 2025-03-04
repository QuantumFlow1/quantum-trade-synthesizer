
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useDashboard } from "@/contexts/DashboardContext";
import { toast } from "@/hooks/use-toast";
import { fetchAdminApiKey } from "@/components/chat/services/utils/apiHelpers";

export const useApiStatus = (initialStatus: 'checking' | 'available' | 'unavailable') => {
  const [localApiStatus, setLocalApiStatus] = useState<'checking' | 'available' | 'unavailable'>(initialStatus);
  const [isCheckingKeys, setIsCheckingKeys] = useState(false);
  const { setApiStatus } = useDashboard();

  useEffect(() => {
    if (initialStatus === 'checking') {
      checkApiStatus();
    } else {
      setLocalApiStatus(initialStatus);
    }
    
    // Add an event listener for storage changes to detect when API keys are updated in another window/tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.includes('ApiKey')) {
        console.log('API key changed in localStorage, rechecking API status');
        checkApiStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for any localStorage changes directly in this window
    window.addEventListener('localStorage-changed', () => {
      console.log('localStorage-changed event triggered, rechecking API status');
      checkApiStatus();
    });
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage-changed', checkApiStatus);
    };
  }, [initialStatus]);

  const checkApiStatus = async () => {
    try {
      setLocalApiStatus('checking');
      setIsCheckingKeys(true);
      
      // First, check if we have any API keys configured
      const adminKeys = await checkApiKeysAvailability();
      const userKeys = checkLocalStorageKeys();
      
      console.log('API key check results:', {
        adminKeys,
        userKeys
      });
      
      if (!adminKeys && !userKeys) {
        console.log("No API keys available - marking API as unavailable");
        setLocalApiStatus('unavailable');
        setApiStatus('unavailable');
        setIsCheckingKeys(false);
        return;
      }
      
      // Try to ping the Grok3 API through the edge function
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "ping", context: [] }
      });
      
      if (error) throw error;
      const newStatus = 'available';
      setLocalApiStatus(newStatus);
      setApiStatus(newStatus); // Update global context state
      console.log("API is available");
      
      toast({
        title: "API verbinding succesvol",
        description: "De AI-services zijn nu beschikbaar.",
      });
    } catch (error) {
      console.error("Failed to verify API status:", error);
      const newStatus = 'unavailable';
      setLocalApiStatus(newStatus);
      setApiStatus(newStatus); // Update global context state
      console.log("API is unavailable");
      
      // Show a toast with the error message
      toast({
        title: "API niet beschikbaar",
        description: "De AI-services zijn momenteel niet beschikbaar. Controleer uw API sleutels in instellingen.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingKeys(false);
    }
  };
  
  // Function to check if any admin API keys are available
  const checkApiKeysAvailability = async (): Promise<boolean> => {
    try {
      const hasOpenAI = await fetchAdminApiKey('openai');
      const hasClaude = await fetchAdminApiKey('claude');
      const hasGemini = await fetchAdminApiKey('gemini');
      const hasDeepseek = await fetchAdminApiKey('deepseek');
      
      const hasAnyKey = !!(hasOpenAI || hasClaude || hasGemini || hasDeepseek);
      console.log("Admin API keys availability check:", {
        openai: !!hasOpenAI,
        claude: !!hasClaude, 
        gemini: !!hasGemini,
        deepseek: !!hasDeepseek,
        hasAnyKey
      });
      
      return hasAnyKey;
    } catch (error) {
      console.error("Error checking admin API keys:", error);
      return false;
    }
  };
  
  // Function to check localStorage for user API keys
  const checkLocalStorageKeys = (): boolean => {
    const openaiKey = localStorage.getItem('openaiApiKey');
    const claudeKey = localStorage.getItem('claudeApiKey');
    const geminiKey = localStorage.getItem('geminiApiKey');
    const deepseekKey = localStorage.getItem('deepseekApiKey');
    
    const hasAnyKey = !!(openaiKey || claudeKey || geminiKey || deepseekKey);
    console.log("LocalStorage API keys availability check:", {
      openai: !!openaiKey,
      claude: !!claudeKey,
      gemini: !!geminiKey,
      deepseek: !!deepseekKey,
      hasAnyKey
    });
    
    return hasAnyKey;
  };

  return {
    apiStatus: localApiStatus,
    isCheckingKeys,
    checkApiStatus
  };
};
