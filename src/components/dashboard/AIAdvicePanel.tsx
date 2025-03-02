
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AdvicePanel } from "./advice/AdvicePanel";
import { LoadingPanel } from "./advice/LoadingPanel";
import { UnavailablePanel } from "./advice/UnavailablePanel";

interface AIAdvicePanelProps {
  apiStatus?: 'checking' | 'available' | 'unavailable';
  isCheckingKeys?: boolean;
  onManualCheck?: () => void;
}

export function AIAdvicePanel({ apiStatus = 'checking', isCheckingKeys = false, onManualCheck }: AIAdvicePanelProps) {
  const { toast } = useToast();
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeySheetOpen, setIsKeySheetOpen] = useState(false);
  
  // Load advice if API is available
  useEffect(() => {
    if (apiStatus === 'available') {
      fetchAdvice();
    }

    // Add listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [apiStatus]);

  const handleStorageChange = () => {
    // If API keys change in another tab
    if (apiStatus === 'available') {
      fetchAdvice();
    }
  };

  const fetchAdvice = async () => {
    if (apiStatus !== 'available') {
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('generate-advice', {
        body: { topic: "trading" }
      });
      
      if (error) throw error;
      
      if (data && data.advice) {
        setAdvice(data.advice);
      } else {
        console.error("No advice returned from API");
      }
    } catch (error) {
      console.error("Failed to fetch advice:", error);
      setAdvice(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualCheck = () => {
    if (onManualCheck) {
      onManualCheck();
      toast({
        title: "API status controleren",
        description: "Verbinding met AI-services wordt gecontroleerd..."
      });
    }
  };

  // Render appropriate panel based on API status
  if (apiStatus === 'unavailable') {
    return <UnavailablePanel isCheckingKeys={isCheckingKeys} onManualCheck={handleManualCheck} />;
  }

  if (apiStatus === 'checking' || isLoading) {
    return <LoadingPanel />;
  }

  return <AdvicePanel advice={advice} onRefresh={fetchAdvice} />;
}
