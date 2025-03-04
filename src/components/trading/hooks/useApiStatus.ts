
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { fetchAdminApiKey } from "@/components/chat/services/utils/apiHelpers";
import { toast } from "@/components/ui/use-toast";

export function useApiStatus(initialStatus: 'checking' | 'available' | 'unavailable' = 'checking') {
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>(initialStatus);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkAPIAvailability = async () => {
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

  const verifyApiStatus = useCallback(async () => {
    setIsVerifying(true);
    try {
      const hasKeys = await checkAPIAvailability();
      
      if (!hasKeys) {
        console.log("No API keys available");
        setApiStatus('unavailable');
        toast({
          title: "API service unavailable",
          description: "No API keys available. Please configure API keys in settings.",
          variant: "destructive"
        });
        setLastChecked(new Date());
        setIsVerifying(false);
        return;
      }
      
      // Try to ping the Grok3 API
      const { data, error } = await supabase.functions.invoke('grok3-ping', {
        body: { isAvailabilityCheck: true }
      });
      
      if (error) {
        console.error("Failed to verify API status:", error);
        setApiStatus('unavailable');
        toast({
          title: "Connection error",
          description: "Failed to connect to AI services: " + error.message,
          variant: "destructive"
        });
      } else if (data?.status === 'available') {
        console.log("API is available");
        setApiStatus('available');
        toast({
          title: "Connected to AI services",
          description: "Successfully connected to AI trading services.",
          duration: 3000
        });
      } else {
        console.error("API is unavailable:", data?.message);
        setApiStatus('unavailable');
        toast({
          title: "API service unavailable",
          description: data?.message || "AI services are currently unavailable",
          variant: "destructive"
        });
      }
      
      setLastChecked(new Date());
    } catch (error) {
      console.error("Exception verifying API status:", error);
      setApiStatus('unavailable');
      toast({
        title: "Connection error",
        description: "An unexpected error occurred while checking API status",
        variant: "destructive"
      });
      setLastChecked(new Date());
    } finally {
      setIsVerifying(false);
    }
  }, []);

  // Check API status on component mount
  useEffect(() => {
    if (apiStatus === 'checking') {
      verifyApiStatus();
    }
  }, [apiStatus, verifyApiStatus]);

  return {
    apiStatus,
    setApiStatus,
    isVerifying,
    verifyApiStatus,
    lastChecked
  };
}
