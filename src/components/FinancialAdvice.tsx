
import { useState, useEffect } from "react";
import { AdviceHeader } from "./financial-advice/AdviceHeader";
import { AIInsights } from "./financial-advice/AIInsights";
import { RiskReturnAnalysis } from "./financial-advice/RiskReturnAnalysis";
import { PortfolioDiversification } from "./financial-advice/PortfolioDiversification";
import { Recommendations } from "./financial-advice/Recommendations";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiKeySetupDialog } from "./trading/agent-communication/ApiKeySetupDialog";

const FinancialAdvice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const { toast } = useToast();
  const isOnline = navigator.onLine;
  
  // Check if OpenAI API key is available
  const [openaiKeyAvailable, setOpenaiKeyAvailable] = useState(false);
  
  useEffect(() => {
    // Check localStorage for the OpenAI API key
    const openaiKey = localStorage.getItem('openaiApiKey');
    setOpenaiKeyAvailable(!!openaiKey);
    
    // Listen for API key updates
    const handleApiKeyUpdate = (event: Event) => {
      if ((event as CustomEvent).detail?.keyType === 'openai') {
        const action = (event as CustomEvent).detail?.action;
        setOpenaiKeyAvailable(action === 'set');
      }
    };
    
    window.addEventListener('api-key-update', handleApiKeyUpdate);
    return () => window.removeEventListener('api-key-update', handleApiKeyUpdate);
  }, []);

  const handleGenerateAdvice = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to generate AI analysis",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Call the edge function to generate advice
      const { data, error } = await supabase.functions.invoke('generate-advice', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) {
        console.error("Error from edge function:", error);
        throw new Error(`Failed to generate advice: ${error.message}`);
      }
      
      if (!data || !data.advice) {
        throw new Error("Received invalid response from server");
      }
      
      setAiAdvice(data.advice);
      
      // Show a different toast message based on whether real AI or fallback was used
      if (data.source === 'fallback') {
        toast({
          title: "Using Simulated Analysis",
          description: "Real AI service unavailable. Using simulated financial insights.",
          variant: "warning",
        });
      } else {
        toast({
          title: "AI Analysis Complete",
          description: "New financial insights are available",
        });
      }
    } catch (error) {
      console.error("Failed to generate advice:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate AI analysis",
        variant: "destructive",
      });
      setAiAdvice("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!openaiKeyAvailable && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>OpenAI API key not configured. Financial advice will use simulated data.</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsApiKeyDialogOpen(true)}
            >
              Configure API Key
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <AdviceHeader 
        isOnline={isOnline} 
        isLoadingAI={isLoading}
        onGenerateAdvice={handleGenerateAdvice} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AIInsights 
          isOnline={isOnline}
          aiAdvice={aiAdvice}
        />
        <RiskReturnAnalysis />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioDiversification />
        <Recommendations />
      </div>
      
      <ApiKeySetupDialog 
        isOpen={isApiKeyDialogOpen}
        onClose={() => setIsApiKeyDialogOpen(false)}
        onSuccess={() => {
          setOpenaiKeyAvailable(true);
          toast({
            title: "API Key Configured",
            description: "You can now generate real AI-powered financial advice",
          });
        }}
      />
    </div>
  );
};

export default FinancialAdvice;
