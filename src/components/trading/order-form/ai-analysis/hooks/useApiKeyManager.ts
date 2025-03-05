
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { fetchAdminApiKey } from "@/components/chat/services/utils/apiHelpers";

export const useApiKeyManager = () => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isKeySheetOpen, setIsKeySheetOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'available' | 'unavailable' | 'checking'>('checking');
  
  const loadSavedKeys = () => {
    const savedOpenAI = localStorage.getItem('openaiApiKey');
    const savedClaude = localStorage.getItem('claudeApiKey');
    const savedGemini = localStorage.getItem('geminiApiKey');
    const savedDeepseek = localStorage.getItem('deepseekApiKey');
    
    if (savedOpenAI) setOpenaiKey(savedOpenAI);
    if (savedClaude) setClaudeKey(savedClaude);
    if (savedGemini) setGeminiKey(savedGemini);
    if (savedDeepseek) setDeepseekKey(savedDeepseek);
  };
  
  const saveApiKeys = () => {
    if (openaiKey) localStorage.setItem('openaiApiKey', openaiKey);
    if (claudeKey) localStorage.setItem('claudeApiKey', claudeKey);
    if (geminiKey) localStorage.setItem('geminiApiKey', geminiKey);
    if (deepseekKey) localStorage.setItem('deepseekApiKey', deepseekKey);
    
    toast({
      title: "API sleutels opgeslagen",
      description: "Uw API sleutels zijn opgeslagen. Controleer opnieuw de verbinding.",
    });
    
    setIsKeySheetOpen(false);
    
    // Automatically check API availability after saving keys
    setTimeout(() => {
      handleManualUpdate();
    }, 500);
  };

  // Checks if API keys are available
  const checkAPIAvailability = async () => {
    try {
      // Check for admin API keys
      const hasOpenAI = await fetchAdminApiKey('openai');
      const hasClaude = await fetchAdminApiKey('claude');
      const hasGemini = await fetchAdminApiKey('gemini');
      const hasDeepseek = await fetchAdminApiKey('deepseek');
      
      // Check for user API keys in localStorage
      const openaiKey = localStorage.getItem('openaiApiKey');
      const claudeKey = localStorage.getItem('claudeApiKey');
      const geminiKey = localStorage.getItem('geminiApiKey');
      const deepseekKey = localStorage.getItem('deepseekApiKey');
      
      // If at least one key is available, we can proceed
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

  const handleManualUpdate = async () => {
    setIsChecking(true);
    setApiKeyStatus('checking');
    
    toast({
      title: "Handmatige verbinding",
      description: "Proberen te verbinden met de AI service...",
    });
    
    try {
      // First check if any API keys are available
      const hasKeys = await checkAPIAvailability();
      
      if (!hasKeys) {
        setApiKeyStatus('unavailable');
        throw new Error("Geen API sleutels geconfigureerd");
      }
      
      // Check the API connection
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "ping", context: [] }
      });
      
      if (error) throw error;
      
      // If we reach here, the connection was successful
      setApiKeyStatus('available');
      
      toast({
        title: "Verbinding geslaagd",
        description: "De AI analyseservice is nu beschikbaar.",
      });
    } catch (error) {
      console.error("Fout bij verbinden met AI service:", error);
      setApiKeyStatus('unavailable');
      
      let errorMessage = "De AI analyseservice is momenteel niet beschikbaar.";
      
      if (error.message && error.message.includes("API sleutels")) {
        errorMessage = "Er zijn geen API sleutels geconfigureerd. Voeg deze toe via het admin paneel of in uw persoonlijke instellingen.";
      }
      
      toast({
        title: "Verbindingsstatus",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Add the missing methods that AIAnalysisPanel expects
  const handleOpenApiKeySheet = () => {
    setIsKeySheetOpen(true);
    loadSavedKeys(); // Load saved keys when opening the sheet
  };

  const handleCloseApiKeySheet = () => {
    setIsKeySheetOpen(false);
  };

  return {
    isChecking,
    isKeySheetOpen,
    openaiKey,
    setOpenaiKey,
    claudeKey,
    setClaudeKey,
    geminiKey,
    setGeminiKey,
    deepseekKey,
    setDeepseekKey,
    loadSavedKeys,
    saveApiKeys,
    checkAPIAvailability,
    handleManualUpdate,
    apiKeyStatus,
    // Add these to match what AIAnalysisPanel is expecting
    showApiKeySheet: isKeySheetOpen,
    handleOpenApiKeySheet,
    handleCloseApiKeySheet
  };
};
