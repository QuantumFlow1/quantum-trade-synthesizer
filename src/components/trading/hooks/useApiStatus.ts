
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { fetchAdminApiKey } from "@/components/chat/services/utils/apiHelpers";

export function useApiStatus(initialStatus: 'checking' | 'available' | 'unavailable' = 'checking') {
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>(initialStatus);
  const [isVerifying, setIsVerifying] = useState(false);

  const checkAPIAvailability = async () => {
    try {
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
      
      console.log("API sleutels beschikbaarheidscontrole:", {
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
        console.log("Geen API sleutels beschikbaar");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Fout bij controleren API sleutels:", error);
      return false;
    }
  };

  const verifyApiStatus = async () => {
    setIsVerifying(true);
    try {
      const hasKeys = await checkAPIAvailability();
      
      if (!hasKeys) {
        console.log("Geen API sleutels beschikbaar");
        setApiStatus('unavailable');
        setIsVerifying(false);
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "ping", context: [] }
      });
      
      if (error) throw error;
      setApiStatus('available');
      console.log("API is available");
    } catch (error) {
      console.error("Failed to verify API status:", error);
      setApiStatus('unavailable');
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (apiStatus === 'checking') {
      verifyApiStatus();
    }
  }, [apiStatus]);

  return {
    apiStatus,
    setApiStatus,
    isVerifying,
    verifyApiStatus
  };
}
